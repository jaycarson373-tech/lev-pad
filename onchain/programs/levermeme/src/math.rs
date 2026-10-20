//! Fixed-point risk arithmetic. This module does not enable trade execution.
pub const BPS: u128 = 10_000;
pub const MAX_LEVERAGE: u8 = 10;

pub fn notional(margin: u64, leverage: u8) -> Option<u64> {
    if margin == 0 || !(1..=MAX_LEVERAGE).contains(&leverage) {
        return None;
    }
    margin.checked_mul(u64::from(leverage))
}
pub fn fee_ceil(amount: u64, bps: u16) -> Option<u64> {
    if bps > 10_000 {
        return None;
    }
    let value = u128::from(amount)
        .checked_mul(u128::from(bps))?
        .checked_add(BPS - 1)?
        / BPS;
    u64::try_from(value).ok()
}
pub fn pnl(size: u64, entry: u64, mark: u64, long: bool) -> Option<i128> {
    if entry == 0 || mark == 0 {
        return None;
    }
    let change = i128::from(mark).checked_sub(i128::from(entry))?;
    let result = i128::from(size).checked_mul(change)? / i128::from(entry);
    if long {
        Some(result)
    } else {
        result.checked_neg()
    }
}
pub fn liquidatable(
    margin: u64,
    size: u64,
    entry: u64,
    mark: u64,
    long: bool,
    maintenance_bps: u16,
) -> Option<bool> {
    if maintenance_bps == 0 || maintenance_bps >= 10_000 {
        return None;
    }
    let equity = i128::from(margin).checked_add(pnl(size, entry, mark, long)?)?;
    Some(equity <= i128::from(fee_ceil(size, maintenance_bps)?))
}
pub fn split_fee(amount: u64, shares: [u16; 4]) -> Option<[u64; 4]> {
    if shares.iter().map(|v| u32::from(*v)).sum::<u32>() != 10_000 {
        return None;
    }
    let mut out = [0; 4];
    let mut allocated = 0u64;
    let mut largest = 0usize;
    for i in 0..4 {
        out[i] =
            u64::try_from(u128::from(amount).checked_mul(u128::from(shares[i]))? / BPS).ok()?;
        allocated = allocated.checked_add(out[i])?;
        if shares[i] > shares[largest] {
            largest = i;
        }
    }
    out[largest] = out[largest].checked_add(amount.checked_sub(allocated)?)?;
    Some(out)
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn leverage_limits_and_overflow() {
        assert_eq!(notional(100, 10), Some(1000));
        for lev in [0, 11, 255] {
            assert_eq!(notional(100, lev), None);
        }
        assert_eq!(notional(0, 1), None);
        assert_eq!(notional(u64::MAX, 10), None);
    }
    #[test]
    fn exact_long_short_pnl() {
        assert_eq!(pnl(1000, 100, 110, true), Some(100));
        assert_eq!(pnl(1000, 100, 110, false), Some(-100));
        assert_eq!(pnl(1000, 100, 90, true), Some(-100));
        assert_eq!(pnl(1000, 100, 90, false), Some(100));
        assert_eq!(pnl(1, 0, 10, true), None);
    }
    #[test]
    fn liquidation_accounts_for_maintenance() {
        assert_eq!(liquidatable(100, 1000, 100, 91, true, 100), Some(true));
        assert_eq!(liquidatable(100, 1000, 100, 92, true, 100), Some(false));
        assert_eq!(liquidatable(100, 1000, 100, 109, false, 100), Some(true));
    }
    #[test]
    fn fees_round_up_and_conserve_splits() {
        assert_eq!(fee_ceil(1, 1), Some(1));
        assert_eq!(fee_ceil(u64::MAX, 10_000), Some(u64::MAX));
        for amount in 0..10_000 {
            let parts = split_fee(amount, [2500; 4]).unwrap();
            assert_eq!(parts.iter().sum::<u64>(), amount);
        }
        assert_eq!(split_fee(100, [1, 2, 3, 4]), None);
    }
    #[test]
    fn pnl_direction_symmetry() {
        for entry in 1..150 {
            for mark in 1..150 {
                assert_eq!(
                    pnl(1000, entry, mark, true).unwrap(),
                    -pnl(1000, entry, mark, false).unwrap()
                );
            }
        }
    }
}
