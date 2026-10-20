//! TEST ONLY. Not Jupiter or Pump code; proves LeverMeme's local postconditions
//! and rollback behavior against deterministic CPI counterpart programs.
use anchor_lang::prelude::SolanaSysvar;
use anchor_lang::solana_program::{
    account_info::AccountInfo,
    entrypoint::ProgramResult,
    program::{invoke, invoke_signed},
    program_error::ProgramError,
    pubkey::Pubkey,
};
use anchor_spl::token_interface::spl_token_2022::instruction::transfer_checked;
anchor_lang::solana_program::entrypoint!(process_instruction);
fn amount(data: &[u8], at: usize) -> Result<u64, ProgramError> {
    Ok(u64::from_le_bytes(
        data.get(at..at + 8)
            .ok_or(ProgramError::InvalidInstructionData)?
            .try_into()
            .map_err(|_| ProgramError::InvalidInstructionData)?,
    ))
}
pub fn process_instruction(program_id: &Pubkey, a: &[AccountInfo], data: &[u8]) -> ProgramResult {
    if data.len() == 17 {
        // [wallet, source, output, inputMint, outputMint, poolInput, poolOutput,
        //  poolAuthority, inputProgram, outputProgram]
        if a.len() < 10 {
            return Err(ProgramError::NotEnoughAccountKeys);
        }
        let input = amount(data, 1)?;
        let output = amount(data, 9)?;
        let in_decimals = a[3].try_borrow_data()?[44];
        let out_decimals = a[4].try_borrow_data()?[44];
        invoke(
            &transfer_checked(
                a[8].key,
                a[1].key,
                a[3].key,
                a[5].key,
                a[0].key,
                &[],
                input,
                in_decimals,
            )?,
            a,
        )?;
        let (_, bump) = Pubkey::find_program_address(&[b"fixture-pool"], program_id);
        invoke_signed(
            &transfer_checked(
                a[9].key,
                a[6].key,
                a[4].key,
                a[2].key,
                a[7].key,
                &[],
                output,
                out_decimals,
            )?,
            a,
            &[&[b"fixture-pool", &[bump]]],
        )?;
        if data[0] == 1 && a.len() > 10 {
            // Deliberate unrelated wallet-token theft attempt. Production code
            // must reject the extra writable account before this is reached.
            invoke(
                &transfer_checked(
                    a[8].key,
                    a[10].key,
                    a[3].key,
                    a[5].key,
                    a[0].key,
                    &[],
                    1,
                    in_decimals,
                )?,
                a,
            )?;
        }
        return Ok(());
    }
    if data == [20, 22, 86, 123, 198, 28, 219, 132] {
        // Mock Pump native creator collection; fee vault is a system-owned PDA.
        let (_, bump) =
            Pubkey::find_program_address(&[b"creator-vault", a[0].key.as_ref()], program_id);
        let rent = anchor_lang::prelude::Rent::get()?.minimum_balance(a[1].data_len());
        let n = a[1]
            .lamports()
            .checked_sub(rent)
            .ok_or(ProgramError::InsufficientFunds)?;
        let mut transfer_data = vec![2, 0, 0, 0];
        transfer_data.extend_from_slice(&n.to_le_bytes());
        let instruction = anchor_lang::solana_program::instruction::Instruction {
            program_id: Pubkey::default(),
            accounts: vec![
                anchor_lang::solana_program::instruction::AccountMeta::new(*a[1].key, true),
                anchor_lang::solana_program::instruction::AccountMeta::new(*a[0].key, false),
            ],
            data: transfer_data,
        };
        return invoke_signed(
            &instruction,
            a,
            &[&[b"creator-vault", a[0].key.as_ref(), &[bump]]],
        );
    }
    let (creator, authority, source, destination, mint, token, seed) =
        if data == [207, 17, 138, 242, 4, 34, 19, 56] {
            (0, 2, 3, 1, 4, 5, b"creator-vault".as_slice())
        } else if data == [160, 57, 89, 42, 181, 139, 43, 66] {
            (2, 3, 4, 5, 0, 1, b"creator_vault".as_slice())
        } else {
            return Err(ProgramError::InvalidInstructionData);
        };
    let bytes = a[source].try_borrow_data()?;
    let n = amount(&bytes, 64)?;
    drop(bytes);
    let decimals = a[mint].try_borrow_data()?[44];
    let (_, bump) = Pubkey::find_program_address(&[seed, a[creator].key.as_ref()], program_id);
    invoke_signed(
        &transfer_checked(
            a[token].key,
            a[source].key,
            a[mint].key,
            a[destination].key,
            a[authority].key,
            &[],
            n,
            decimals,
        )?,
        a,
        &[&[seed, a[creator].key.as_ref(), &[bump]]],
    )
}
