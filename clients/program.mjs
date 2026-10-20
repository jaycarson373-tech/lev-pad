// clients/generated/accounts/airdropCampaign.ts
import {
  assertAccountExists,
  assertAccountsExist,
  combineCodec,
  decodeAccount,
  fetchEncodedAccount,
  fetchEncodedAccounts,
  fixDecoderSize,
  fixEncoderSize,
  getAddressDecoder,
  getAddressEncoder,
  getBooleanDecoder,
  getBooleanEncoder,
  getBytesDecoder,
  getBytesEncoder,
  getI64Decoder,
  getI64Encoder,
  getStructDecoder,
  getStructEncoder,
  getU64Decoder,
  getU64Encoder,
  getU8Decoder,
  getU8Encoder,
  transformEncoder
} from "@solana/kit";
var AIRDROP_CAMPAIGN_DISCRIMINATOR = new Uint8Array([235, 102, 51, 70, 37, 179, 248, 13]);
function getAirdropCampaignDiscriminatorBytes() {
  return fixEncoderSize(getBytesEncoder(), 8).encode(
    AIRDROP_CAMPAIGN_DISCRIMINATOR
  );
}
function getAirdropCampaignEncoder() {
  return transformEncoder(
    getStructEncoder([
      ["discriminator", fixEncoderSize(getBytesEncoder(), 8)],
      ["protocol", getAddressEncoder()],
      ["root", fixEncoderSize(getBytesEncoder(), 32)],
      ["total", getU64Encoder()],
      ["claimed", getU64Encoder()],
      ["startsAt", getI64Encoder()],
      ["endsAt", getI64Encoder()],
      ["reclaimed", getBooleanEncoder()],
      ["bump", getU8Encoder()]
    ]),
    (value) => ({ ...value, discriminator: AIRDROP_CAMPAIGN_DISCRIMINATOR })
  );
}
function getAirdropCampaignDecoder() {
  return getStructDecoder([
    ["discriminator", fixDecoderSize(getBytesDecoder(), 8)],
    ["protocol", getAddressDecoder()],
    ["root", fixDecoderSize(getBytesDecoder(), 32)],
    ["total", getU64Decoder()],
    ["claimed", getU64Decoder()],
    ["startsAt", getI64Decoder()],
    ["endsAt", getI64Decoder()],
    ["reclaimed", getBooleanDecoder()],
    ["bump", getU8Decoder()]
  ]);
}
function getAirdropCampaignCodec() {
  return combineCodec(getAirdropCampaignEncoder(), getAirdropCampaignDecoder());
}
function decodeAirdropCampaign(encodedAccount) {
  return decodeAccount(
    encodedAccount,
    getAirdropCampaignDecoder()
  );
}
async function fetchAirdropCampaign(rpc, address, config) {
  const maybeAccount = await fetchMaybeAirdropCampaign(rpc, address, config);
  assertAccountExists(maybeAccount);
  return maybeAccount;
}
async function fetchMaybeAirdropCampaign(rpc, address, config) {
  const maybeAccount = await fetchEncodedAccount(
    "rpc" in rpc ? rpc.rpc : rpc,
    typeof address === "string" ? address : address.address,
    config
  );
  return decodeAirdropCampaign(maybeAccount);
}
async function fetchAllAirdropCampaign(rpc, addresses, config) {
  const maybeAccounts = await fetchAllMaybeAirdropCampaign(
    rpc,
    addresses,
    config
  );
  assertAccountsExist(maybeAccounts);
  return maybeAccounts;
}
async function fetchAllMaybeAirdropCampaign(rpc, addresses, config) {
  const maybeAccounts = await fetchEncodedAccounts(
    "rpc" in rpc ? rpc.rpc : rpc,
    addresses.map((a) => typeof a === "string" ? a : a.address),
    config
  );
  return maybeAccounts.map(
    (maybeAccount) => decodeAirdropCampaign(maybeAccount)
  );
}
function getAirdropCampaignSize() {
  return 106;
}

// clients/generated/accounts/airdropClaim.ts
import {
  assertAccountExists as assertAccountExists2,
  assertAccountsExist as assertAccountsExist2,
  combineCodec as combineCodec2,
  decodeAccount as decodeAccount2,
  fetchEncodedAccount as fetchEncodedAccount2,
  fetchEncodedAccounts as fetchEncodedAccounts2,
  fixDecoderSize as fixDecoderSize2,
  fixEncoderSize as fixEncoderSize2,
  getAddressDecoder as getAddressDecoder2,
  getAddressEncoder as getAddressEncoder2,
  getBytesDecoder as getBytesDecoder2,
  getBytesEncoder as getBytesEncoder2,
  getStructDecoder as getStructDecoder2,
  getStructEncoder as getStructEncoder2,
  getU64Decoder as getU64Decoder2,
  getU64Encoder as getU64Encoder2,
  transformEncoder as transformEncoder2
} from "@solana/kit";
var AIRDROP_CLAIM_DISCRIMINATOR = new Uint8Array([
  231,
  12,
  74,
  54,
  245,
  181,
  248,
  38
]);
function getAirdropClaimDiscriminatorBytes() {
  return fixEncoderSize2(getBytesEncoder2(), 8).encode(
    AIRDROP_CLAIM_DISCRIMINATOR
  );
}
function getAirdropClaimEncoder() {
  return transformEncoder2(
    getStructEncoder2([
      ["discriminator", fixEncoderSize2(getBytesEncoder2(), 8)],
      ["campaign", getAddressEncoder2()],
      ["owner", getAddressEncoder2()],
      ["index", getU64Encoder2()],
      ["amount", getU64Encoder2()]
    ]),
    (value) => ({ ...value, discriminator: AIRDROP_CLAIM_DISCRIMINATOR })
  );
}
function getAirdropClaimDecoder() {
  return getStructDecoder2([
    ["discriminator", fixDecoderSize2(getBytesDecoder2(), 8)],
    ["campaign", getAddressDecoder2()],
    ["owner", getAddressDecoder2()],
    ["index", getU64Decoder2()],
    ["amount", getU64Decoder2()]
  ]);
}
function getAirdropClaimCodec() {
  return combineCodec2(getAirdropClaimEncoder(), getAirdropClaimDecoder());
}
function decodeAirdropClaim(encodedAccount) {
  return decodeAccount2(
    encodedAccount,
    getAirdropClaimDecoder()
  );
}
async function fetchAirdropClaim(rpc, address, config) {
  const maybeAccount = await fetchMaybeAirdropClaim(rpc, address, config);
  assertAccountExists2(maybeAccount);
  return maybeAccount;
}
async function fetchMaybeAirdropClaim(rpc, address, config) {
  const maybeAccount = await fetchEncodedAccount2(
    "rpc" in rpc ? rpc.rpc : rpc,
    typeof address === "string" ? address : address.address,
    config
  );
  return decodeAirdropClaim(maybeAccount);
}
async function fetchAllAirdropClaim(rpc, addresses, config) {
  const maybeAccounts = await fetchAllMaybeAirdropClaim(rpc, addresses, config);
  assertAccountsExist2(maybeAccounts);
  return maybeAccounts;
}
async function fetchAllMaybeAirdropClaim(rpc, addresses, config) {
  const maybeAccounts = await fetchEncodedAccounts2(
    "rpc" in rpc ? rpc.rpc : rpc,
    addresses.map((a) => typeof a === "string" ? a : a.address),
    config
  );
  return maybeAccounts.map((maybeAccount) => decodeAirdropClaim(maybeAccount));
}
function getAirdropClaimSize() {
  return 88;
}

// clients/generated/accounts/listing.ts
import {
  assertAccountExists as assertAccountExists3,
  assertAccountsExist as assertAccountsExist3,
  combineCodec as combineCodec3,
  decodeAccount as decodeAccount3,
  fetchEncodedAccount as fetchEncodedAccount3,
  fetchEncodedAccounts as fetchEncodedAccounts3,
  fixDecoderSize as fixDecoderSize3,
  fixEncoderSize as fixEncoderSize3,
  getAddressDecoder as getAddressDecoder3,
  getAddressEncoder as getAddressEncoder3,
  getBooleanDecoder as getBooleanDecoder2,
  getBooleanEncoder as getBooleanEncoder2,
  getBytesDecoder as getBytesDecoder3,
  getBytesEncoder as getBytesEncoder3,
  getI64Decoder as getI64Decoder2,
  getI64Encoder as getI64Encoder2,
  getStructDecoder as getStructDecoder3,
  getStructEncoder as getStructEncoder3,
  getU64Decoder as getU64Decoder3,
  getU64Encoder as getU64Encoder3,
  getU8Decoder as getU8Decoder2,
  getU8Encoder as getU8Encoder2,
  transformEncoder as transformEncoder3
} from "@solana/kit";
var LISTING_DISCRIMINATOR = new Uint8Array([
  218,
  32,
  50,
  73,
  43,
  134,
  26,
  58
]);
function getListingDiscriminatorBytes() {
  return fixEncoderSize3(getBytesEncoder3(), 8).encode(LISTING_DISCRIMINATOR);
}
function getListingEncoder() {
  return transformEncoder3(
    getStructEncoder3([
      ["discriminator", fixEncoderSize3(getBytesEncoder3(), 8)],
      ["protocol", getAddressEncoder3()],
      ["lister", getAddressEncoder3()],
      ["baseMint", getAddressEncoder3()],
      ["baseVault", getAddressEncoder3()],
      ["solLamports", getU64Encoder3()],
      ["tokenAmount", getU64Encoder3()],
      ["burned", getU64Encoder3()],
      ["requestedAt", getI64Encoder2()],
      ["cancelled", getBooleanEncoder2()],
      ["approved", getBooleanEncoder2()],
      ["bump", getU8Encoder2()]
    ]),
    (value) => ({ ...value, discriminator: LISTING_DISCRIMINATOR })
  );
}
function getListingDecoder() {
  return getStructDecoder3([
    ["discriminator", fixDecoderSize3(getBytesDecoder3(), 8)],
    ["protocol", getAddressDecoder3()],
    ["lister", getAddressDecoder3()],
    ["baseMint", getAddressDecoder3()],
    ["baseVault", getAddressDecoder3()],
    ["solLamports", getU64Decoder3()],
    ["tokenAmount", getU64Decoder3()],
    ["burned", getU64Decoder3()],
    ["requestedAt", getI64Decoder2()],
    ["cancelled", getBooleanDecoder2()],
    ["approved", getBooleanDecoder2()],
    ["bump", getU8Decoder2()]
  ]);
}
function getListingCodec() {
  return combineCodec3(getListingEncoder(), getListingDecoder());
}
function decodeListing(encodedAccount) {
  return decodeAccount3(
    encodedAccount,
    getListingDecoder()
  );
}
async function fetchListing(rpc, address, config) {
  const maybeAccount = await fetchMaybeListing(rpc, address, config);
  assertAccountExists3(maybeAccount);
  return maybeAccount;
}
async function fetchMaybeListing(rpc, address, config) {
  const maybeAccount = await fetchEncodedAccount3(
    "rpc" in rpc ? rpc.rpc : rpc,
    typeof address === "string" ? address : address.address,
    config
  );
  return decodeListing(maybeAccount);
}
async function fetchAllListing(rpc, addresses, config) {
  const maybeAccounts = await fetchAllMaybeListing(rpc, addresses, config);
  assertAccountsExist3(maybeAccounts);
  return maybeAccounts;
}
async function fetchAllMaybeListing(rpc, addresses, config) {
  const maybeAccounts = await fetchEncodedAccounts3(
    "rpc" in rpc ? rpc.rpc : rpc,
    addresses.map((a) => typeof a === "string" ? a : a.address),
    config
  );
  return maybeAccounts.map((maybeAccount) => decodeListing(maybeAccount));
}
function getListingSize() {
  return 171;
}

// clients/generated/accounts/marginAccount.ts
import {
  assertAccountExists as assertAccountExists4,
  assertAccountsExist as assertAccountsExist4,
  combineCodec as combineCodec4,
  decodeAccount as decodeAccount4,
  fetchEncodedAccount as fetchEncodedAccount4,
  fetchEncodedAccounts as fetchEncodedAccounts4,
  fixDecoderSize as fixDecoderSize4,
  fixEncoderSize as fixEncoderSize4,
  getAddressDecoder as getAddressDecoder4,
  getAddressEncoder as getAddressEncoder4,
  getBytesDecoder as getBytesDecoder4,
  getBytesEncoder as getBytesEncoder4,
  getStructDecoder as getStructDecoder4,
  getStructEncoder as getStructEncoder4,
  getU64Decoder as getU64Decoder4,
  getU64Encoder as getU64Encoder4,
  getU8Decoder as getU8Decoder3,
  getU8Encoder as getU8Encoder3,
  transformEncoder as transformEncoder4
} from "@solana/kit";
var MARGIN_ACCOUNT_DISCRIMINATOR = new Uint8Array([
  133,
  220,
  173,
  213,
  179,
  211,
  43,
  238
]);
function getMarginAccountDiscriminatorBytes() {
  return fixEncoderSize4(getBytesEncoder4(), 8).encode(
    MARGIN_ACCOUNT_DISCRIMINATOR
  );
}
function getMarginAccountEncoder() {
  return transformEncoder4(
    getStructEncoder4([
      ["discriminator", fixEncoderSize4(getBytesEncoder4(), 8)],
      ["protocol", getAddressEncoder4()],
      ["owner", getAddressEncoder4()],
      ["vault", getAddressEncoder4()],
      ["balance", getU64Encoder4()],
      ["bump", getU8Encoder3()]
    ]),
    (value) => ({ ...value, discriminator: MARGIN_ACCOUNT_DISCRIMINATOR })
  );
}
function getMarginAccountDecoder() {
  return getStructDecoder4([
    ["discriminator", fixDecoderSize4(getBytesDecoder4(), 8)],
    ["protocol", getAddressDecoder4()],
    ["owner", getAddressDecoder4()],
    ["vault", getAddressDecoder4()],
    ["balance", getU64Decoder4()],
    ["bump", getU8Decoder3()]
  ]);
}
function getMarginAccountCodec() {
  return combineCodec4(getMarginAccountEncoder(), getMarginAccountDecoder());
}
function decodeMarginAccount(encodedAccount) {
  return decodeAccount4(
    encodedAccount,
    getMarginAccountDecoder()
  );
}
async function fetchMarginAccount(rpc, address, config) {
  const maybeAccount = await fetchMaybeMarginAccount(rpc, address, config);
  assertAccountExists4(maybeAccount);
  return maybeAccount;
}
async function fetchMaybeMarginAccount(rpc, address, config) {
  const maybeAccount = await fetchEncodedAccount4(
    "rpc" in rpc ? rpc.rpc : rpc,
    typeof address === "string" ? address : address.address,
    config
  );
  return decodeMarginAccount(maybeAccount);
}
async function fetchAllMarginAccount(rpc, addresses, config) {
  const maybeAccounts = await fetchAllMaybeMarginAccount(
    rpc,
    addresses,
    config
  );
  assertAccountsExist4(maybeAccounts);
  return maybeAccounts;
}
async function fetchAllMaybeMarginAccount(rpc, addresses, config) {
  const maybeAccounts = await fetchEncodedAccounts4(
    "rpc" in rpc ? rpc.rpc : rpc,
    addresses.map((a) => typeof a === "string" ? a : a.address),
    config
  );
  return maybeAccounts.map((maybeAccount) => decodeMarginAccount(maybeAccount));
}
function getMarginAccountSize() {
  return 113;
}

// clients/generated/accounts/protocol.ts
import {
  assertAccountExists as assertAccountExists5,
  assertAccountsExist as assertAccountsExist5,
  combineCodec as combineCodec6,
  decodeAccount as decodeAccount5,
  fetchEncodedAccount as fetchEncodedAccount5,
  fetchEncodedAccounts as fetchEncodedAccounts5,
  fixDecoderSize as fixDecoderSize5,
  fixEncoderSize as fixEncoderSize5,
  getAddressDecoder as getAddressDecoder6,
  getAddressEncoder as getAddressEncoder6,
  getBooleanDecoder as getBooleanDecoder3,
  getBooleanEncoder as getBooleanEncoder3,
  getBytesDecoder as getBytesDecoder5,
  getBytesEncoder as getBytesEncoder5,
  getStructDecoder as getStructDecoder6,
  getStructEncoder as getStructEncoder6,
  getU64Decoder as getU64Decoder6,
  getU64Encoder as getU64Encoder6,
  getU8Decoder as getU8Decoder4,
  getU8Encoder as getU8Encoder4,
  transformEncoder as transformEncoder5
} from "@solana/kit";

// clients/generated/types/listingPolicy.ts
import {
  combineCodec as combineCodec5,
  getAddressDecoder as getAddressDecoder5,
  getAddressEncoder as getAddressEncoder5,
  getArrayDecoder,
  getArrayEncoder,
  getStructDecoder as getStructDecoder5,
  getStructEncoder as getStructEncoder5,
  getU16Decoder,
  getU16Encoder,
  getU64Decoder as getU64Decoder5,
  getU64Encoder as getU64Encoder5
} from "@solana/kit";
function getListingPolicyEncoder() {
  return getStructEncoder5([
    ["burnAmount", getU64Encoder5()],
    ["minSolLamports", getU64Encoder5()],
    ["feeBps", getU16Encoder()],
    ["feeShares", getArrayEncoder(getU16Encoder(), { size: 4 })],
    ["feeDestinations", getArrayEncoder(getAddressEncoder5(), { size: 3 })]
  ]);
}
function getListingPolicyDecoder() {
  return getStructDecoder5([
    ["burnAmount", getU64Decoder5()],
    ["minSolLamports", getU64Decoder5()],
    ["feeBps", getU16Decoder()],
    ["feeShares", getArrayDecoder(getU16Decoder(), { size: 4 })],
    ["feeDestinations", getArrayDecoder(getAddressDecoder5(), { size: 3 })]
  ]);
}
function getListingPolicyCodec() {
  return combineCodec5(getListingPolicyEncoder(), getListingPolicyDecoder());
}

// clients/generated/accounts/protocol.ts
var PROTOCOL_DISCRIMINATOR = new Uint8Array([
  45,
  39,
  101,
  43,
  115,
  72,
  131,
  40
]);
function getProtocolDiscriminatorBytes() {
  return fixEncoderSize5(getBytesEncoder5(), 8).encode(PROTOCOL_DISCRIMINATOR);
}
function getProtocolEncoder() {
  return transformEncoder5(
    getStructEncoder6([
      ["discriminator", fixEncoderSize5(getBytesEncoder5(), 8)],
      ["version", getU8Encoder4()],
      ["admin", getAddressEncoder6()],
      ["leverMint", getAddressEncoder6()],
      ["quoteMint", getAddressEncoder6()],
      ["policy", getListingPolicyEncoder()],
      ["paused", getBooleanEncoder3()],
      ["bump", getU8Encoder4()],
      ["totalBurned", getU64Encoder6()],
      ["listingCount", getU64Encoder6()],
      ["initialSupply", getU64Encoder6()],
      ["platformRevenue", getU64Encoder6()],
      ["tokenCreatorRevenue", getU64Encoder6()]
    ]),
    (value) => ({ ...value, discriminator: PROTOCOL_DISCRIMINATOR })
  );
}
function getProtocolDecoder() {
  return getStructDecoder6([
    ["discriminator", fixDecoderSize5(getBytesDecoder5(), 8)],
    ["version", getU8Decoder4()],
    ["admin", getAddressDecoder6()],
    ["leverMint", getAddressDecoder6()],
    ["quoteMint", getAddressDecoder6()],
    ["policy", getListingPolicyDecoder()],
    ["paused", getBooleanDecoder3()],
    ["bump", getU8Decoder4()],
    ["totalBurned", getU64Decoder6()],
    ["listingCount", getU64Decoder6()],
    ["initialSupply", getU64Decoder6()],
    ["platformRevenue", getU64Decoder6()],
    ["tokenCreatorRevenue", getU64Decoder6()]
  ]);
}
function getProtocolCodec() {
  return combineCodec6(getProtocolEncoder(), getProtocolDecoder());
}
function decodeProtocol(encodedAccount) {
  return decodeAccount5(
    encodedAccount,
    getProtocolDecoder()
  );
}
async function fetchProtocol(rpc, address, config) {
  const maybeAccount = await fetchMaybeProtocol(rpc, address, config);
  assertAccountExists5(maybeAccount);
  return maybeAccount;
}
async function fetchMaybeProtocol(rpc, address, config) {
  const maybeAccount = await fetchEncodedAccount5(
    "rpc" in rpc ? rpc.rpc : rpc,
    typeof address === "string" ? address : address.address,
    config
  );
  return decodeProtocol(maybeAccount);
}
async function fetchAllProtocol(rpc, addresses, config) {
  const maybeAccounts = await fetchAllMaybeProtocol(rpc, addresses, config);
  assertAccountsExist5(maybeAccounts);
  return maybeAccounts;
}
async function fetchAllMaybeProtocol(rpc, addresses, config) {
  const maybeAccounts = await fetchEncodedAccounts5(
    "rpc" in rpc ? rpc.rpc : rpc,
    addresses.map((a) => typeof a === "string" ? a : a.address),
    config
  );
  return maybeAccounts.map((maybeAccount) => decodeProtocol(maybeAccount));
}
function getProtocolSize() {
  return 269;
}

// clients/generated/errors/levermeme.ts
import {
  isProgramError
} from "@solana/kit";

// clients/generated/programs/levermeme.ts
import {
  assertIsInstructionWithAccounts,
  containsBytes,
  extendClient,
  fixEncoderSize as fixEncoderSize19,
  getBytesEncoder as getBytesEncoder27,
  SOLANA_ERROR__PROGRAM_CLIENTS__FAILED_TO_IDENTIFY_ACCOUNT,
  SOLANA_ERROR__PROGRAM_CLIENTS__FAILED_TO_IDENTIFY_INSTRUCTION,
  SOLANA_ERROR__PROGRAM_CLIENTS__UNRECOGNIZED_INSTRUCTION_TYPE,
  SolanaError as SolanaError14
} from "@solana/kit";
import {
  addSelfFetchFunctions,
  addSelfPlanAndSendFunctions
} from "@solana/kit/program-client-core";

// clients/generated/instructions/cancelListing.ts
import {
  combineCodec as combineCodec7,
  fixDecoderSize as fixDecoderSize6,
  fixEncoderSize as fixEncoderSize6,
  getBytesDecoder as getBytesDecoder6,
  getBytesEncoder as getBytesEncoder14,
  getStructDecoder as getStructDecoder7,
  getStructEncoder as getStructEncoder7,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS,
  SolanaError,
  transformEncoder as transformEncoder6
} from "@solana/kit";
import {
  getAccountMetaFactory,
  getAddressFromResolvedInstructionAccount
} from "@solana/kit/program-client-core";

// clients/generated/pdas/airdropVault.ts
import {
  getAddressEncoder as getAddressEncoder7,
  getBytesEncoder as getBytesEncoder6,
  getProgramDerivedAddress
} from "@solana/kit";
async function findAirdropVaultPda(seeds, config = {}) {
  const {
    programAddress: programAddressInput = "Fg6PaFpoGXkYsidMpWxTWqkZ7FEfcYkgMQhgS1h5A9t"
  } = config;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  return await getProgramDerivedAddress({
    programAddress,
    seeds: [
      getBytesEncoder6().encode(
        new Uint8Array([
          97,
          105,
          114,
          100,
          114,
          111,
          112,
          45,
          118,
          97,
          117,
          108,
          116
        ])
      ),
      getAddressEncoder7().encode(seeds.campaign)
    ]
  });
}

// clients/generated/pdas/baseVault.ts
import {
  getAddressEncoder as getAddressEncoder8,
  getBytesEncoder as getBytesEncoder7,
  getProgramDerivedAddress as getProgramDerivedAddress2
} from "@solana/kit";
async function findBaseVaultPda(seeds, config = {}) {
  const {
    programAddress: programAddressInput = "Fg6PaFpoGXkYsidMpWxTWqkZ7FEfcYkgMQhgS1h5A9t"
  } = config;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  return await getProgramDerivedAddress2({
    programAddress,
    seeds: [
      getBytesEncoder7().encode(
        new Uint8Array([98, 97, 115, 101, 45, 118, 97, 117, 108, 116])
      ),
      getAddressEncoder8().encode(seeds.listing)
    ]
  });
}

// clients/generated/pdas/campaign.ts
import {
  getAddressEncoder as getAddressEncoder9,
  getBytesEncoder as getBytesEncoder8,
  getProgramDerivedAddress as getProgramDerivedAddress3
} from "@solana/kit";
async function findCampaignPda(seeds, config = {}) {
  const {
    programAddress: programAddressInput = "Fg6PaFpoGXkYsidMpWxTWqkZ7FEfcYkgMQhgS1h5A9t"
  } = config;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  return await getProgramDerivedAddress3({
    programAddress,
    seeds: [
      getBytesEncoder8().encode(
        new Uint8Array([97, 105, 114, 100, 114, 111, 112])
      ),
      getAddressEncoder9().encode(seeds.protocol)
    ]
  });
}

// clients/generated/pdas/claim.ts
import {
  getAddressEncoder as getAddressEncoder10,
  getBytesEncoder as getBytesEncoder9,
  getProgramDerivedAddress as getProgramDerivedAddress4
} from "@solana/kit";
async function findClaimPda(seeds, config = {}) {
  const {
    programAddress: programAddressInput = "Fg6PaFpoGXkYsidMpWxTWqkZ7FEfcYkgMQhgS1h5A9t"
  } = config;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  return await getProgramDerivedAddress4({
    programAddress,
    seeds: [
      getBytesEncoder9().encode(new Uint8Array([99, 108, 97, 105, 109])),
      getAddressEncoder10().encode(seeds.campaign),
      getAddressEncoder10().encode(seeds.owner)
    ]
  });
}

// clients/generated/pdas/listing.ts
import {
  getAddressEncoder as getAddressEncoder11,
  getBytesEncoder as getBytesEncoder10,
  getProgramDerivedAddress as getProgramDerivedAddress5
} from "@solana/kit";
async function findListingPda(seeds, config = {}) {
  const {
    programAddress: programAddressInput = "Fg6PaFpoGXkYsidMpWxTWqkZ7FEfcYkgMQhgS1h5A9t"
  } = config;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  return await getProgramDerivedAddress5({
    programAddress,
    seeds: [
      getBytesEncoder10().encode(
        new Uint8Array([108, 105, 115, 116, 105, 110, 103])
      ),
      getAddressEncoder11().encode(seeds.protocol),
      getAddressEncoder11().encode(seeds.baseMint)
    ]
  });
}

// clients/generated/pdas/margin.ts
import {
  getAddressEncoder as getAddressEncoder12,
  getBytesEncoder as getBytesEncoder11,
  getProgramDerivedAddress as getProgramDerivedAddress6
} from "@solana/kit";
async function findMarginPda(seeds, config = {}) {
  const {
    programAddress: programAddressInput = "Fg6PaFpoGXkYsidMpWxTWqkZ7FEfcYkgMQhgS1h5A9t"
  } = config;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  return await getProgramDerivedAddress6({
    programAddress,
    seeds: [
      getBytesEncoder11().encode(new Uint8Array([109, 97, 114, 103, 105, 110])),
      getAddressEncoder12().encode(seeds.protocol),
      getAddressEncoder12().encode(seeds.owner)
    ]
  });
}

// clients/generated/pdas/protocol.ts
import {
  getAddressEncoder as getAddressEncoder13,
  getBytesEncoder as getBytesEncoder12,
  getProgramDerivedAddress as getProgramDerivedAddress7
} from "@solana/kit";
async function findProtocolPda(seeds, config = {}) {
  const {
    programAddress: programAddressInput = "Fg6PaFpoGXkYsidMpWxTWqkZ7FEfcYkgMQhgS1h5A9t"
  } = config;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  return await getProgramDerivedAddress7({
    programAddress,
    seeds: [
      getBytesEncoder12().encode(
        new Uint8Array([112, 114, 111, 116, 111, 99, 111, 108])
      ),
      getAddressEncoder13().encode(seeds.admin)
    ]
  });
}

// clients/generated/pdas/quoteVault.ts
import {
  getAddressEncoder as getAddressEncoder14,
  getBytesEncoder as getBytesEncoder13,
  getProgramDerivedAddress as getProgramDerivedAddress8
} from "@solana/kit";
async function findQuoteVaultPda(seeds, config = {}) {
  const {
    programAddress: programAddressInput = "Fg6PaFpoGXkYsidMpWxTWqkZ7FEfcYkgMQhgS1h5A9t"
  } = config;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  return await getProgramDerivedAddress8({
    programAddress,
    seeds: [
      getBytesEncoder13().encode(
        new Uint8Array([113, 117, 111, 116, 101, 45, 118, 97, 117, 108, 116])
      ),
      getAddressEncoder14().encode(seeds.margin)
    ]
  });
}

// clients/generated/instructions/cancelListing.ts
var CANCEL_LISTING_DISCRIMINATOR = new Uint8Array([
  41,
  183,
  50,
  232,
  230,
  233,
  157,
  70
]);
function getCancelListingDiscriminatorBytes() {
  return fixEncoderSize6(getBytesEncoder14(), 8).encode(
    CANCEL_LISTING_DISCRIMINATOR
  );
}
function getCancelListingInstructionDataEncoder() {
  return transformEncoder6(
    getStructEncoder7([["discriminator", fixEncoderSize6(getBytesEncoder14(), 8)]]),
    (value) => ({ ...value, discriminator: CANCEL_LISTING_DISCRIMINATOR })
  );
}
function getCancelListingInstructionDataDecoder() {
  return getStructDecoder7([
    ["discriminator", fixDecoderSize6(getBytesDecoder6(), 8)]
  ]);
}
function getCancelListingInstructionDataCodec() {
  return combineCodec7(
    getCancelListingInstructionDataEncoder(),
    getCancelListingInstructionDataDecoder()
  );
}
async function getCancelListingInstructionAsync(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory(programAddress, "programId");
  const originalAccounts = {
    lister: { value: input.lister ?? null, isSigner: true, isWritable: true },
    protocol: {
      value: input.protocol ?? null,
      isSigner: false,
      isWritable: false
    },
    listing: {
      value: input.listing ?? null,
      isSigner: false,
      isWritable: true
    },
    baseMint: {
      value: input.baseMint ?? null,
      isSigner: false,
      isWritable: false
    },
    baseVault: {
      value: input.baseVault ?? null,
      isSigner: false,
      isWritable: true
    },
    baseDestination: {
      value: input.baseDestination ?? null,
      isSigner: false,
      isWritable: true
    },
    baseProgram: {
      value: input.baseProgram ?? null,
      isSigner: false,
      isWritable: false
    }
  };
  const accounts = originalAccounts;
  if (!accounts.listing.value) {
    accounts.listing.value = await findListingPda(
      {
        protocol: getAddressFromResolvedInstructionAccount(
          "protocol",
          accounts.protocol.value
        ),
        baseMint: getAddressFromResolvedInstructionAccount(
          "baseMint",
          accounts.baseMint.value
        )
      },
      { programAddress }
    );
  }
  if (!accounts.baseVault.value) {
    accounts.baseVault.value = await findBaseVaultPda(
      {
        listing: getAddressFromResolvedInstructionAccount(
          "listing",
          accounts.listing.value
        )
      },
      { programAddress }
    );
  }
  return Object.freeze({
    accounts: [
      getAccountMeta("lister", accounts.lister),
      getAccountMeta("protocol", accounts.protocol),
      getAccountMeta("listing", accounts.listing),
      getAccountMeta("baseMint", accounts.baseMint),
      getAccountMeta("baseVault", accounts.baseVault),
      getAccountMeta("baseDestination", accounts.baseDestination),
      getAccountMeta("baseProgram", accounts.baseProgram)
    ],
    data: getCancelListingInstructionDataEncoder().encode({}),
    programAddress
  });
}
function getCancelListingInstruction(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory(programAddress, "programId");
  const originalAccounts = {
    lister: { value: input.lister ?? null, isSigner: true, isWritable: true },
    protocol: {
      value: input.protocol ?? null,
      isSigner: false,
      isWritable: false
    },
    listing: {
      value: input.listing ?? null,
      isSigner: false,
      isWritable: true
    },
    baseMint: {
      value: input.baseMint ?? null,
      isSigner: false,
      isWritable: false
    },
    baseVault: {
      value: input.baseVault ?? null,
      isSigner: false,
      isWritable: true
    },
    baseDestination: {
      value: input.baseDestination ?? null,
      isSigner: false,
      isWritable: true
    },
    baseProgram: {
      value: input.baseProgram ?? null,
      isSigner: false,
      isWritable: false
    }
  };
  const accounts = originalAccounts;
  return Object.freeze({
    accounts: [
      getAccountMeta("lister", accounts.lister),
      getAccountMeta("protocol", accounts.protocol),
      getAccountMeta("listing", accounts.listing),
      getAccountMeta("baseMint", accounts.baseMint),
      getAccountMeta("baseVault", accounts.baseVault),
      getAccountMeta("baseDestination", accounts.baseDestination),
      getAccountMeta("baseProgram", accounts.baseProgram)
    ],
    data: getCancelListingInstructionDataEncoder().encode({}),
    programAddress
  });
}
function parseCancelListingInstruction(instruction) {
  if (instruction.accounts.length < 7) {
    throw new SolanaError(
      SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS,
      {
        actualAccountMetas: instruction.accounts.length,
        expectedAccountMetas: 7
      }
    );
  }
  let accountIndex = 0;
  const getNextAccount = () => {
    const accountMeta = instruction.accounts[accountIndex];
    accountIndex += 1;
    return accountMeta;
  };
  return {
    programAddress: instruction.programAddress,
    accounts: {
      lister: getNextAccount(),
      protocol: getNextAccount(),
      listing: getNextAccount(),
      baseMint: getNextAccount(),
      baseVault: getNextAccount(),
      baseDestination: getNextAccount(),
      baseProgram: getNextAccount()
    },
    data: getCancelListingInstructionDataDecoder().decode(instruction.data)
  };
}

// clients/generated/instructions/claimAirdrop.ts
import {
  combineCodec as combineCodec8,
  fixDecoderSize as fixDecoderSize7,
  fixEncoderSize as fixEncoderSize7,
  getArrayDecoder as getArrayDecoder2,
  getArrayEncoder as getArrayEncoder2,
  getBytesDecoder as getBytesDecoder7,
  getBytesEncoder as getBytesEncoder15,
  getStructDecoder as getStructDecoder8,
  getStructEncoder as getStructEncoder8,
  getU64Decoder as getU64Decoder7,
  getU64Encoder as getU64Encoder7,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS2,
  SolanaError as SolanaError2,
  transformEncoder as transformEncoder7
} from "@solana/kit";
import {
  getAccountMetaFactory as getAccountMetaFactory2,
  getAddressFromResolvedInstructionAccount as getAddressFromResolvedInstructionAccount2
} from "@solana/kit/program-client-core";
var CLAIM_AIRDROP_DISCRIMINATOR = new Uint8Array([
  137,
  50,
  122,
  111,
  89,
  254,
  8,
  20
]);
function getClaimAirdropDiscriminatorBytes() {
  return fixEncoderSize7(getBytesEncoder15(), 8).encode(
    CLAIM_AIRDROP_DISCRIMINATOR
  );
}
function getClaimAirdropInstructionDataEncoder() {
  return transformEncoder7(
    getStructEncoder8([
      ["discriminator", fixEncoderSize7(getBytesEncoder15(), 8)],
      ["index", getU64Encoder7()],
      ["amount", getU64Encoder7()],
      ["proof", getArrayEncoder2(fixEncoderSize7(getBytesEncoder15(), 32))]
    ]),
    (value) => ({ ...value, discriminator: CLAIM_AIRDROP_DISCRIMINATOR })
  );
}
function getClaimAirdropInstructionDataDecoder() {
  return getStructDecoder8([
    ["discriminator", fixDecoderSize7(getBytesDecoder7(), 8)],
    ["index", getU64Decoder7()],
    ["amount", getU64Decoder7()],
    ["proof", getArrayDecoder2(fixDecoderSize7(getBytesDecoder7(), 32))]
  ]);
}
function getClaimAirdropInstructionDataCodec() {
  return combineCodec8(
    getClaimAirdropInstructionDataEncoder(),
    getClaimAirdropInstructionDataDecoder()
  );
}
async function getClaimAirdropInstructionAsync(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory2(programAddress, "programId");
  const originalAccounts = {
    owner: { value: input.owner ?? null, isSigner: true, isWritable: true },
    protocol: {
      value: input.protocol ?? null,
      isSigner: false,
      isWritable: false
    },
    campaign: {
      value: input.campaign ?? null,
      isSigner: false,
      isWritable: true
    },
    claim: { value: input.claim ?? null, isSigner: false, isWritable: true },
    leverMint: {
      value: input.leverMint ?? null,
      isSigner: false,
      isWritable: false
    },
    airdropVault: {
      value: input.airdropVault ?? null,
      isSigner: false,
      isWritable: true
    },
    destination: {
      value: input.destination ?? null,
      isSigner: false,
      isWritable: true
    },
    leverProgram: {
      value: input.leverProgram ?? null,
      isSigner: false,
      isWritable: false
    },
    systemProgram: {
      value: input.systemProgram ?? null,
      isSigner: false,
      isWritable: false
    }
  };
  const accounts = originalAccounts;
  const args = { ...input };
  if (!accounts.campaign.value) {
    accounts.campaign.value = await findCampaignPda(
      {
        protocol: getAddressFromResolvedInstructionAccount2(
          "protocol",
          accounts.protocol.value
        )
      },
      { programAddress }
    );
  }
  if (!accounts.claim.value) {
    accounts.claim.value = await findClaimPda(
      {
        campaign: getAddressFromResolvedInstructionAccount2(
          "campaign",
          accounts.campaign.value
        ),
        owner: getAddressFromResolvedInstructionAccount2(
          "owner",
          accounts.owner.value
        )
      },
      { programAddress }
    );
  }
  if (!accounts.airdropVault.value) {
    accounts.airdropVault.value = await findAirdropVaultPda(
      {
        campaign: getAddressFromResolvedInstructionAccount2(
          "campaign",
          accounts.campaign.value
        )
      },
      { programAddress }
    );
  }
  if (!accounts.systemProgram.value) {
    accounts.systemProgram.value = "11111111111111111111111111111111";
  }
  return Object.freeze({
    accounts: [
      getAccountMeta("owner", accounts.owner),
      getAccountMeta("protocol", accounts.protocol),
      getAccountMeta("campaign", accounts.campaign),
      getAccountMeta("claim", accounts.claim),
      getAccountMeta("leverMint", accounts.leverMint),
      getAccountMeta("airdropVault", accounts.airdropVault),
      getAccountMeta("destination", accounts.destination),
      getAccountMeta("leverProgram", accounts.leverProgram),
      getAccountMeta("systemProgram", accounts.systemProgram)
    ],
    data: getClaimAirdropInstructionDataEncoder().encode(
      args
    ),
    programAddress
  });
}
function getClaimAirdropInstruction(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory2(programAddress, "programId");
  const originalAccounts = {
    owner: { value: input.owner ?? null, isSigner: true, isWritable: true },
    protocol: {
      value: input.protocol ?? null,
      isSigner: false,
      isWritable: false
    },
    campaign: {
      value: input.campaign ?? null,
      isSigner: false,
      isWritable: true
    },
    claim: { value: input.claim ?? null, isSigner: false, isWritable: true },
    leverMint: {
      value: input.leverMint ?? null,
      isSigner: false,
      isWritable: false
    },
    airdropVault: {
      value: input.airdropVault ?? null,
      isSigner: false,
      isWritable: true
    },
    destination: {
      value: input.destination ?? null,
      isSigner: false,
      isWritable: true
    },
    leverProgram: {
      value: input.leverProgram ?? null,
      isSigner: false,
      isWritable: false
    },
    systemProgram: {
      value: input.systemProgram ?? null,
      isSigner: false,
      isWritable: false
    }
  };
  const accounts = originalAccounts;
  const args = { ...input };
  if (!accounts.systemProgram.value) {
    accounts.systemProgram.value = "11111111111111111111111111111111";
  }
  return Object.freeze({
    accounts: [
      getAccountMeta("owner", accounts.owner),
      getAccountMeta("protocol", accounts.protocol),
      getAccountMeta("campaign", accounts.campaign),
      getAccountMeta("claim", accounts.claim),
      getAccountMeta("leverMint", accounts.leverMint),
      getAccountMeta("airdropVault", accounts.airdropVault),
      getAccountMeta("destination", accounts.destination),
      getAccountMeta("leverProgram", accounts.leverProgram),
      getAccountMeta("systemProgram", accounts.systemProgram)
    ],
    data: getClaimAirdropInstructionDataEncoder().encode(
      args
    ),
    programAddress
  });
}
function parseClaimAirdropInstruction(instruction) {
  if (instruction.accounts.length < 9) {
    throw new SolanaError2(
      SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS2,
      {
        actualAccountMetas: instruction.accounts.length,
        expectedAccountMetas: 9
      }
    );
  }
  let accountIndex = 0;
  const getNextAccount = () => {
    const accountMeta = instruction.accounts[accountIndex];
    accountIndex += 1;
    return accountMeta;
  };
  return {
    programAddress: instruction.programAddress,
    accounts: {
      owner: getNextAccount(),
      protocol: getNextAccount(),
      campaign: getNextAccount(),
      claim: getNextAccount(),
      leverMint: getNextAccount(),
      airdropVault: getNextAccount(),
      destination: getNextAccount(),
      leverProgram: getNextAccount(),
      systemProgram: getNextAccount()
    },
    data: getClaimAirdropInstructionDataDecoder().decode(instruction.data)
  };
}

// clients/generated/instructions/createAirdrop.ts
import {
  combineCodec as combineCodec9,
  fixDecoderSize as fixDecoderSize8,
  fixEncoderSize as fixEncoderSize8,
  getBytesDecoder as getBytesDecoder8,
  getBytesEncoder as getBytesEncoder16,
  getI64Decoder as getI64Decoder3,
  getI64Encoder as getI64Encoder3,
  getStructDecoder as getStructDecoder9,
  getStructEncoder as getStructEncoder9,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS3,
  SolanaError as SolanaError3,
  transformEncoder as transformEncoder8
} from "@solana/kit";
import {
  getAccountMetaFactory as getAccountMetaFactory3,
  getAddressFromResolvedInstructionAccount as getAddressFromResolvedInstructionAccount3
} from "@solana/kit/program-client-core";
var CREATE_AIRDROP_DISCRIMINATOR = new Uint8Array([
  227,
  135,
  208,
  66,
  137,
  177,
  80,
  94
]);
function getCreateAirdropDiscriminatorBytes() {
  return fixEncoderSize8(getBytesEncoder16(), 8).encode(
    CREATE_AIRDROP_DISCRIMINATOR
  );
}
function getCreateAirdropInstructionDataEncoder() {
  return transformEncoder8(
    getStructEncoder9([
      ["discriminator", fixEncoderSize8(getBytesEncoder16(), 8)],
      ["root", fixEncoderSize8(getBytesEncoder16(), 32)],
      ["startsAt", getI64Encoder3()],
      ["endsAt", getI64Encoder3()]
    ]),
    (value) => ({ ...value, discriminator: CREATE_AIRDROP_DISCRIMINATOR })
  );
}
function getCreateAirdropInstructionDataDecoder() {
  return getStructDecoder9([
    ["discriminator", fixDecoderSize8(getBytesDecoder8(), 8)],
    ["root", fixDecoderSize8(getBytesDecoder8(), 32)],
    ["startsAt", getI64Decoder3()],
    ["endsAt", getI64Decoder3()]
  ]);
}
function getCreateAirdropInstructionDataCodec() {
  return combineCodec9(
    getCreateAirdropInstructionDataEncoder(),
    getCreateAirdropInstructionDataDecoder()
  );
}
async function getCreateAirdropInstructionAsync(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory3(programAddress, "programId");
  const originalAccounts = {
    admin: { value: input.admin ?? null, isSigner: true, isWritable: true },
    protocol: {
      value: input.protocol ?? null,
      isSigner: false,
      isWritable: false
    },
    leverMint: {
      value: input.leverMint ?? null,
      isSigner: false,
      isWritable: false
    },
    campaign: {
      value: input.campaign ?? null,
      isSigner: false,
      isWritable: true
    },
    airdropVault: {
      value: input.airdropVault ?? null,
      isSigner: false,
      isWritable: true
    },
    source: { value: input.source ?? null, isSigner: false, isWritable: true },
    leverProgram: {
      value: input.leverProgram ?? null,
      isSigner: false,
      isWritable: false
    },
    systemProgram: {
      value: input.systemProgram ?? null,
      isSigner: false,
      isWritable: false
    }
  };
  const accounts = originalAccounts;
  const args = { ...input };
  if (!accounts.campaign.value) {
    accounts.campaign.value = await findCampaignPda(
      {
        protocol: getAddressFromResolvedInstructionAccount3(
          "protocol",
          accounts.protocol.value
        )
      },
      { programAddress }
    );
  }
  if (!accounts.airdropVault.value) {
    accounts.airdropVault.value = await findAirdropVaultPda(
      {
        campaign: getAddressFromResolvedInstructionAccount3(
          "campaign",
          accounts.campaign.value
        )
      },
      { programAddress }
    );
  }
  if (!accounts.systemProgram.value) {
    accounts.systemProgram.value = "11111111111111111111111111111111";
  }
  return Object.freeze({
    accounts: [
      getAccountMeta("admin", accounts.admin),
      getAccountMeta("protocol", accounts.protocol),
      getAccountMeta("leverMint", accounts.leverMint),
      getAccountMeta("campaign", accounts.campaign),
      getAccountMeta("airdropVault", accounts.airdropVault),
      getAccountMeta("source", accounts.source),
      getAccountMeta("leverProgram", accounts.leverProgram),
      getAccountMeta("systemProgram", accounts.systemProgram)
    ],
    data: getCreateAirdropInstructionDataEncoder().encode(
      args
    ),
    programAddress
  });
}
function getCreateAirdropInstruction(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory3(programAddress, "programId");
  const originalAccounts = {
    admin: { value: input.admin ?? null, isSigner: true, isWritable: true },
    protocol: {
      value: input.protocol ?? null,
      isSigner: false,
      isWritable: false
    },
    leverMint: {
      value: input.leverMint ?? null,
      isSigner: false,
      isWritable: false
    },
    campaign: {
      value: input.campaign ?? null,
      isSigner: false,
      isWritable: true
    },
    airdropVault: {
      value: input.airdropVault ?? null,
      isSigner: false,
      isWritable: true
    },
    source: { value: input.source ?? null, isSigner: false, isWritable: true },
    leverProgram: {
      value: input.leverProgram ?? null,
      isSigner: false,
      isWritable: false
    },
    systemProgram: {
      value: input.systemProgram ?? null,
      isSigner: false,
      isWritable: false
    }
  };
  const accounts = originalAccounts;
  const args = { ...input };
  if (!accounts.systemProgram.value) {
    accounts.systemProgram.value = "11111111111111111111111111111111";
  }
  return Object.freeze({
    accounts: [
      getAccountMeta("admin", accounts.admin),
      getAccountMeta("protocol", accounts.protocol),
      getAccountMeta("leverMint", accounts.leverMint),
      getAccountMeta("campaign", accounts.campaign),
      getAccountMeta("airdropVault", accounts.airdropVault),
      getAccountMeta("source", accounts.source),
      getAccountMeta("leverProgram", accounts.leverProgram),
      getAccountMeta("systemProgram", accounts.systemProgram)
    ],
    data: getCreateAirdropInstructionDataEncoder().encode(
      args
    ),
    programAddress
  });
}
function parseCreateAirdropInstruction(instruction) {
  if (instruction.accounts.length < 8) {
    throw new SolanaError3(
      SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS3,
      {
        actualAccountMetas: instruction.accounts.length,
        expectedAccountMetas: 8
      }
    );
  }
  let accountIndex = 0;
  const getNextAccount = () => {
    const accountMeta = instruction.accounts[accountIndex];
    accountIndex += 1;
    return accountMeta;
  };
  return {
    programAddress: instruction.programAddress,
    accounts: {
      admin: getNextAccount(),
      protocol: getNextAccount(),
      leverMint: getNextAccount(),
      campaign: getNextAccount(),
      airdropVault: getNextAccount(),
      source: getNextAccount(),
      leverProgram: getNextAccount(),
      systemProgram: getNextAccount()
    },
    data: getCreateAirdropInstructionDataDecoder().decode(instruction.data)
  };
}

// clients/generated/instructions/deposit.ts
import {
  combineCodec as combineCodec10,
  fixDecoderSize as fixDecoderSize9,
  fixEncoderSize as fixEncoderSize9,
  getBytesDecoder as getBytesDecoder9,
  getBytesEncoder as getBytesEncoder17,
  getStructDecoder as getStructDecoder10,
  getStructEncoder as getStructEncoder10,
  getU64Decoder as getU64Decoder8,
  getU64Encoder as getU64Encoder8,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS4,
  SolanaError as SolanaError4,
  transformEncoder as transformEncoder9
} from "@solana/kit";
import {
  getAccountMetaFactory as getAccountMetaFactory4,
  getAddressFromResolvedInstructionAccount as getAddressFromResolvedInstructionAccount4
} from "@solana/kit/program-client-core";
var DEPOSIT_DISCRIMINATOR = new Uint8Array([
  242,
  35,
  198,
  137,
  82,
  225,
  242,
  182
]);
function getDepositDiscriminatorBytes() {
  return fixEncoderSize9(getBytesEncoder17(), 8).encode(DEPOSIT_DISCRIMINATOR);
}
function getDepositInstructionDataEncoder() {
  return transformEncoder9(
    getStructEncoder10([
      ["discriminator", fixEncoderSize9(getBytesEncoder17(), 8)],
      ["amount", getU64Encoder8()]
    ]),
    (value) => ({ ...value, discriminator: DEPOSIT_DISCRIMINATOR })
  );
}
function getDepositInstructionDataDecoder() {
  return getStructDecoder10([
    ["discriminator", fixDecoderSize9(getBytesDecoder9(), 8)],
    ["amount", getU64Decoder8()]
  ]);
}
function getDepositInstructionDataCodec() {
  return combineCodec10(
    getDepositInstructionDataEncoder(),
    getDepositInstructionDataDecoder()
  );
}
async function getDepositInstructionAsync(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory4(programAddress, "programId");
  const originalAccounts = {
    owner: { value: input.owner ?? null, isSigner: true, isWritable: false },
    protocol: {
      value: input.protocol ?? null,
      isSigner: false,
      isWritable: false
    },
    margin: { value: input.margin ?? null, isSigner: false, isWritable: true },
    quoteMint: {
      value: input.quoteMint ?? null,
      isSigner: false,
      isWritable: false
    },
    source: { value: input.source ?? null, isSigner: false, isWritable: true },
    quoteVault: {
      value: input.quoteVault ?? null,
      isSigner: false,
      isWritable: true
    },
    quoteProgram: {
      value: input.quoteProgram ?? null,
      isSigner: false,
      isWritable: false
    }
  };
  const accounts = originalAccounts;
  const args = { ...input };
  if (!accounts.margin.value) {
    accounts.margin.value = await findMarginPda(
      {
        protocol: getAddressFromResolvedInstructionAccount4(
          "protocol",
          accounts.protocol.value
        ),
        owner: getAddressFromResolvedInstructionAccount4(
          "owner",
          accounts.owner.value
        )
      },
      { programAddress }
    );
  }
  if (!accounts.quoteVault.value) {
    accounts.quoteVault.value = await findQuoteVaultPda(
      {
        margin: getAddressFromResolvedInstructionAccount4(
          "margin",
          accounts.margin.value
        )
      },
      { programAddress }
    );
  }
  return Object.freeze({
    accounts: [
      getAccountMeta("owner", accounts.owner),
      getAccountMeta("protocol", accounts.protocol),
      getAccountMeta("margin", accounts.margin),
      getAccountMeta("quoteMint", accounts.quoteMint),
      getAccountMeta("source", accounts.source),
      getAccountMeta("quoteVault", accounts.quoteVault),
      getAccountMeta("quoteProgram", accounts.quoteProgram)
    ],
    data: getDepositInstructionDataEncoder().encode(
      args
    ),
    programAddress
  });
}
function getDepositInstruction(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory4(programAddress, "programId");
  const originalAccounts = {
    owner: { value: input.owner ?? null, isSigner: true, isWritable: false },
    protocol: {
      value: input.protocol ?? null,
      isSigner: false,
      isWritable: false
    },
    margin: { value: input.margin ?? null, isSigner: false, isWritable: true },
    quoteMint: {
      value: input.quoteMint ?? null,
      isSigner: false,
      isWritable: false
    },
    source: { value: input.source ?? null, isSigner: false, isWritable: true },
    quoteVault: {
      value: input.quoteVault ?? null,
      isSigner: false,
      isWritable: true
    },
    quoteProgram: {
      value: input.quoteProgram ?? null,
      isSigner: false,
      isWritable: false
    }
  };
  const accounts = originalAccounts;
  const args = { ...input };
  return Object.freeze({
    accounts: [
      getAccountMeta("owner", accounts.owner),
      getAccountMeta("protocol", accounts.protocol),
      getAccountMeta("margin", accounts.margin),
      getAccountMeta("quoteMint", accounts.quoteMint),
      getAccountMeta("source", accounts.source),
      getAccountMeta("quoteVault", accounts.quoteVault),
      getAccountMeta("quoteProgram", accounts.quoteProgram)
    ],
    data: getDepositInstructionDataEncoder().encode(
      args
    ),
    programAddress
  });
}
function parseDepositInstruction(instruction) {
  if (instruction.accounts.length < 7) {
    throw new SolanaError4(
      SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS4,
      {
        actualAccountMetas: instruction.accounts.length,
        expectedAccountMetas: 7
      }
    );
  }
  let accountIndex = 0;
  const getNextAccount = () => {
    const accountMeta = instruction.accounts[accountIndex];
    accountIndex += 1;
    return accountMeta;
  };
  return {
    programAddress: instruction.programAddress,
    accounts: {
      owner: getNextAccount(),
      protocol: getNextAccount(),
      margin: getNextAccount(),
      quoteMint: getNextAccount(),
      source: getNextAccount(),
      quoteVault: getNextAccount(),
      quoteProgram: getNextAccount()
    },
    data: getDepositInstructionDataDecoder().decode(instruction.data)
  };
}

// clients/generated/instructions/initializeProtocol.ts
import {
  combineCodec as combineCodec11,
  fixDecoderSize as fixDecoderSize10,
  fixEncoderSize as fixEncoderSize10,
  getBytesDecoder as getBytesDecoder10,
  getBytesEncoder as getBytesEncoder18,
  getStructDecoder as getStructDecoder11,
  getStructEncoder as getStructEncoder11,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS5,
  SolanaError as SolanaError5,
  transformEncoder as transformEncoder10
} from "@solana/kit";
import {
  getAccountMetaFactory as getAccountMetaFactory5,
  getAddressFromResolvedInstructionAccount as getAddressFromResolvedInstructionAccount5
} from "@solana/kit/program-client-core";
var INITIALIZE_PROTOCOL_DISCRIMINATOR = new Uint8Array([188, 233, 252, 106, 134, 146, 202, 91]);
function getInitializeProtocolDiscriminatorBytes() {
  return fixEncoderSize10(getBytesEncoder18(), 8).encode(
    INITIALIZE_PROTOCOL_DISCRIMINATOR
  );
}
function getInitializeProtocolInstructionDataEncoder() {
  return transformEncoder10(
    getStructEncoder11([
      ["discriminator", fixEncoderSize10(getBytesEncoder18(), 8)],
      ["policy", getListingPolicyEncoder()]
    ]),
    (value) => ({ ...value, discriminator: INITIALIZE_PROTOCOL_DISCRIMINATOR })
  );
}
function getInitializeProtocolInstructionDataDecoder() {
  return getStructDecoder11([
    ["discriminator", fixDecoderSize10(getBytesDecoder10(), 8)],
    ["policy", getListingPolicyDecoder()]
  ]);
}
function getInitializeProtocolInstructionDataCodec() {
  return combineCodec11(
    getInitializeProtocolInstructionDataEncoder(),
    getInitializeProtocolInstructionDataDecoder()
  );
}
async function getInitializeProtocolInstructionAsync(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory5(programAddress, "programId");
  const originalAccounts = {
    admin: { value: input.admin ?? null, isSigner: true, isWritable: true },
    protocol: {
      value: input.protocol ?? null,
      isSigner: false,
      isWritable: true
    },
    leverMint: {
      value: input.leverMint ?? null,
      isSigner: false,
      isWritable: false
    },
    quoteMint: {
      value: input.quoteMint ?? null,
      isSigner: false,
      isWritable: false
    },
    systemProgram: {
      value: input.systemProgram ?? null,
      isSigner: false,
      isWritable: false
    }
  };
  const accounts = originalAccounts;
  const args = { ...input };
  if (!accounts.protocol.value) {
    accounts.protocol.value = await findProtocolPda(
      {
        admin: getAddressFromResolvedInstructionAccount5(
          "admin",
          accounts.admin.value
        )
      },
      { programAddress }
    );
  }
  if (!accounts.systemProgram.value) {
    accounts.systemProgram.value = "11111111111111111111111111111111";
  }
  return Object.freeze({
    accounts: [
      getAccountMeta("admin", accounts.admin),
      getAccountMeta("protocol", accounts.protocol),
      getAccountMeta("leverMint", accounts.leverMint),
      getAccountMeta("quoteMint", accounts.quoteMint),
      getAccountMeta("systemProgram", accounts.systemProgram)
    ],
    data: getInitializeProtocolInstructionDataEncoder().encode(
      args
    ),
    programAddress
  });
}
function getInitializeProtocolInstruction(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory5(programAddress, "programId");
  const originalAccounts = {
    admin: { value: input.admin ?? null, isSigner: true, isWritable: true },
    protocol: {
      value: input.protocol ?? null,
      isSigner: false,
      isWritable: true
    },
    leverMint: {
      value: input.leverMint ?? null,
      isSigner: false,
      isWritable: false
    },
    quoteMint: {
      value: input.quoteMint ?? null,
      isSigner: false,
      isWritable: false
    },
    systemProgram: {
      value: input.systemProgram ?? null,
      isSigner: false,
      isWritable: false
    }
  };
  const accounts = originalAccounts;
  const args = { ...input };
  if (!accounts.systemProgram.value) {
    accounts.systemProgram.value = "11111111111111111111111111111111";
  }
  return Object.freeze({
    accounts: [
      getAccountMeta("admin", accounts.admin),
      getAccountMeta("protocol", accounts.protocol),
      getAccountMeta("leverMint", accounts.leverMint),
      getAccountMeta("quoteMint", accounts.quoteMint),
      getAccountMeta("systemProgram", accounts.systemProgram)
    ],
    data: getInitializeProtocolInstructionDataEncoder().encode(
      args
    ),
    programAddress
  });
}
function parseInitializeProtocolInstruction(instruction) {
  if (instruction.accounts.length < 5) {
    throw new SolanaError5(
      SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS5,
      {
        actualAccountMetas: instruction.accounts.length,
        expectedAccountMetas: 5
      }
    );
  }
  let accountIndex = 0;
  const getNextAccount = () => {
    const accountMeta = instruction.accounts[accountIndex];
    accountIndex += 1;
    return accountMeta;
  };
  return {
    programAddress: instruction.programAddress,
    accounts: {
      admin: getNextAccount(),
      protocol: getNextAccount(),
      leverMint: getNextAccount(),
      quoteMint: getNextAccount(),
      systemProgram: getNextAccount()
    },
    data: getInitializeProtocolInstructionDataDecoder().decode(
      instruction.data
    )
  };
}

// clients/generated/instructions/openMarginAccount.ts
import {
  combineCodec as combineCodec12,
  fixDecoderSize as fixDecoderSize11,
  fixEncoderSize as fixEncoderSize11,
  getBytesDecoder as getBytesDecoder11,
  getBytesEncoder as getBytesEncoder19,
  getStructDecoder as getStructDecoder12,
  getStructEncoder as getStructEncoder12,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS6,
  SolanaError as SolanaError6,
  transformEncoder as transformEncoder11
} from "@solana/kit";
import {
  getAccountMetaFactory as getAccountMetaFactory6,
  getAddressFromResolvedInstructionAccount as getAddressFromResolvedInstructionAccount6
} from "@solana/kit/program-client-core";
var OPEN_MARGIN_ACCOUNT_DISCRIMINATOR = new Uint8Array([251, 54, 54, 233, 180, 125, 203, 107]);
function getOpenMarginAccountDiscriminatorBytes() {
  return fixEncoderSize11(getBytesEncoder19(), 8).encode(
    OPEN_MARGIN_ACCOUNT_DISCRIMINATOR
  );
}
function getOpenMarginAccountInstructionDataEncoder() {
  return transformEncoder11(
    getStructEncoder12([["discriminator", fixEncoderSize11(getBytesEncoder19(), 8)]]),
    (value) => ({ ...value, discriminator: OPEN_MARGIN_ACCOUNT_DISCRIMINATOR })
  );
}
function getOpenMarginAccountInstructionDataDecoder() {
  return getStructDecoder12([
    ["discriminator", fixDecoderSize11(getBytesDecoder11(), 8)]
  ]);
}
function getOpenMarginAccountInstructionDataCodec() {
  return combineCodec12(
    getOpenMarginAccountInstructionDataEncoder(),
    getOpenMarginAccountInstructionDataDecoder()
  );
}
async function getOpenMarginAccountInstructionAsync(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory6(programAddress, "programId");
  const originalAccounts = {
    owner: { value: input.owner ?? null, isSigner: true, isWritable: true },
    protocol: {
      value: input.protocol ?? null,
      isSigner: false,
      isWritable: false
    },
    quoteMint: {
      value: input.quoteMint ?? null,
      isSigner: false,
      isWritable: false
    },
    margin: { value: input.margin ?? null, isSigner: false, isWritable: true },
    quoteVault: {
      value: input.quoteVault ?? null,
      isSigner: false,
      isWritable: true
    },
    quoteProgram: {
      value: input.quoteProgram ?? null,
      isSigner: false,
      isWritable: false
    },
    systemProgram: {
      value: input.systemProgram ?? null,
      isSigner: false,
      isWritable: false
    }
  };
  const accounts = originalAccounts;
  if (!accounts.margin.value) {
    accounts.margin.value = await findMarginPda(
      {
        protocol: getAddressFromResolvedInstructionAccount6(
          "protocol",
          accounts.protocol.value
        ),
        owner: getAddressFromResolvedInstructionAccount6(
          "owner",
          accounts.owner.value
        )
      },
      { programAddress }
    );
  }
  if (!accounts.quoteVault.value) {
    accounts.quoteVault.value = await findQuoteVaultPda(
      {
        margin: getAddressFromResolvedInstructionAccount6(
          "margin",
          accounts.margin.value
        )
      },
      { programAddress }
    );
  }
  if (!accounts.systemProgram.value) {
    accounts.systemProgram.value = "11111111111111111111111111111111";
  }
  return Object.freeze({
    accounts: [
      getAccountMeta("owner", accounts.owner),
      getAccountMeta("protocol", accounts.protocol),
      getAccountMeta("quoteMint", accounts.quoteMint),
      getAccountMeta("margin", accounts.margin),
      getAccountMeta("quoteVault", accounts.quoteVault),
      getAccountMeta("quoteProgram", accounts.quoteProgram),
      getAccountMeta("systemProgram", accounts.systemProgram)
    ],
    data: getOpenMarginAccountInstructionDataEncoder().encode({}),
    programAddress
  });
}
function getOpenMarginAccountInstruction(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory6(programAddress, "programId");
  const originalAccounts = {
    owner: { value: input.owner ?? null, isSigner: true, isWritable: true },
    protocol: {
      value: input.protocol ?? null,
      isSigner: false,
      isWritable: false
    },
    quoteMint: {
      value: input.quoteMint ?? null,
      isSigner: false,
      isWritable: false
    },
    margin: { value: input.margin ?? null, isSigner: false, isWritable: true },
    quoteVault: {
      value: input.quoteVault ?? null,
      isSigner: false,
      isWritable: true
    },
    quoteProgram: {
      value: input.quoteProgram ?? null,
      isSigner: false,
      isWritable: false
    },
    systemProgram: {
      value: input.systemProgram ?? null,
      isSigner: false,
      isWritable: false
    }
  };
  const accounts = originalAccounts;
  if (!accounts.systemProgram.value) {
    accounts.systemProgram.value = "11111111111111111111111111111111";
  }
  return Object.freeze({
    accounts: [
      getAccountMeta("owner", accounts.owner),
      getAccountMeta("protocol", accounts.protocol),
      getAccountMeta("quoteMint", accounts.quoteMint),
      getAccountMeta("margin", accounts.margin),
      getAccountMeta("quoteVault", accounts.quoteVault),
      getAccountMeta("quoteProgram", accounts.quoteProgram),
      getAccountMeta("systemProgram", accounts.systemProgram)
    ],
    data: getOpenMarginAccountInstructionDataEncoder().encode({}),
    programAddress
  });
}
function parseOpenMarginAccountInstruction(instruction) {
  if (instruction.accounts.length < 7) {
    throw new SolanaError6(
      SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS6,
      {
        actualAccountMetas: instruction.accounts.length,
        expectedAccountMetas: 7
      }
    );
  }
  let accountIndex = 0;
  const getNextAccount = () => {
    const accountMeta = instruction.accounts[accountIndex];
    accountIndex += 1;
    return accountMeta;
  };
  return {
    programAddress: instruction.programAddress,
    accounts: {
      owner: getNextAccount(),
      protocol: getNextAccount(),
      quoteMint: getNextAccount(),
      margin: getNextAccount(),
      quoteVault: getNextAccount(),
      quoteProgram: getNextAccount(),
      systemProgram: getNextAccount()
    },
    data: getOpenMarginAccountInstructionDataDecoder().decode(instruction.data)
  };
}

// clients/generated/instructions/reclaimAirdrop.ts
import {
  combineCodec as combineCodec13,
  fixDecoderSize as fixDecoderSize12,
  fixEncoderSize as fixEncoderSize12,
  getBytesDecoder as getBytesDecoder12,
  getBytesEncoder as getBytesEncoder20,
  getStructDecoder as getStructDecoder13,
  getStructEncoder as getStructEncoder13,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS7,
  SolanaError as SolanaError7,
  transformEncoder as transformEncoder12
} from "@solana/kit";
import {
  getAccountMetaFactory as getAccountMetaFactory7,
  getAddressFromResolvedInstructionAccount as getAddressFromResolvedInstructionAccount7
} from "@solana/kit/program-client-core";
var RECLAIM_AIRDROP_DISCRIMINATOR = new Uint8Array(
  [91, 136, 224, 68, 150, 221, 18, 207]
);
function getReclaimAirdropDiscriminatorBytes() {
  return fixEncoderSize12(getBytesEncoder20(), 8).encode(
    RECLAIM_AIRDROP_DISCRIMINATOR
  );
}
function getReclaimAirdropInstructionDataEncoder() {
  return transformEncoder12(
    getStructEncoder13([["discriminator", fixEncoderSize12(getBytesEncoder20(), 8)]]),
    (value) => ({ ...value, discriminator: RECLAIM_AIRDROP_DISCRIMINATOR })
  );
}
function getReclaimAirdropInstructionDataDecoder() {
  return getStructDecoder13([
    ["discriminator", fixDecoderSize12(getBytesDecoder12(), 8)]
  ]);
}
function getReclaimAirdropInstructionDataCodec() {
  return combineCodec13(
    getReclaimAirdropInstructionDataEncoder(),
    getReclaimAirdropInstructionDataDecoder()
  );
}
async function getReclaimAirdropInstructionAsync(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory7(programAddress, "programId");
  const originalAccounts = {
    admin: { value: input.admin ?? null, isSigner: true, isWritable: false },
    protocol: {
      value: input.protocol ?? null,
      isSigner: false,
      isWritable: false
    },
    campaign: {
      value: input.campaign ?? null,
      isSigner: false,
      isWritable: true
    },
    leverMint: {
      value: input.leverMint ?? null,
      isSigner: false,
      isWritable: false
    },
    airdropVault: {
      value: input.airdropVault ?? null,
      isSigner: false,
      isWritable: true
    },
    destination: {
      value: input.destination ?? null,
      isSigner: false,
      isWritable: true
    },
    leverProgram: {
      value: input.leverProgram ?? null,
      isSigner: false,
      isWritable: false
    }
  };
  const accounts = originalAccounts;
  if (!accounts.campaign.value) {
    accounts.campaign.value = await findCampaignPda(
      {
        protocol: getAddressFromResolvedInstructionAccount7(
          "protocol",
          accounts.protocol.value
        )
      },
      { programAddress }
    );
  }
  if (!accounts.airdropVault.value) {
    accounts.airdropVault.value = await findAirdropVaultPda(
      {
        campaign: getAddressFromResolvedInstructionAccount7(
          "campaign",
          accounts.campaign.value
        )
      },
      { programAddress }
    );
  }
  return Object.freeze({
    accounts: [
      getAccountMeta("admin", accounts.admin),
      getAccountMeta("protocol", accounts.protocol),
      getAccountMeta("campaign", accounts.campaign),
      getAccountMeta("leverMint", accounts.leverMint),
      getAccountMeta("airdropVault", accounts.airdropVault),
      getAccountMeta("destination", accounts.destination),
      getAccountMeta("leverProgram", accounts.leverProgram)
    ],
    data: getReclaimAirdropInstructionDataEncoder().encode({}),
    programAddress
  });
}
function getReclaimAirdropInstruction(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory7(programAddress, "programId");
  const originalAccounts = {
    admin: { value: input.admin ?? null, isSigner: true, isWritable: false },
    protocol: {
      value: input.protocol ?? null,
      isSigner: false,
      isWritable: false
    },
    campaign: {
      value: input.campaign ?? null,
      isSigner: false,
      isWritable: true
    },
    leverMint: {
      value: input.leverMint ?? null,
      isSigner: false,
      isWritable: false
    },
    airdropVault: {
      value: input.airdropVault ?? null,
      isSigner: false,
      isWritable: true
    },
    destination: {
      value: input.destination ?? null,
      isSigner: false,
      isWritable: true
    },
    leverProgram: {
      value: input.leverProgram ?? null,
      isSigner: false,
      isWritable: false
    }
  };
  const accounts = originalAccounts;
  return Object.freeze({
    accounts: [
      getAccountMeta("admin", accounts.admin),
      getAccountMeta("protocol", accounts.protocol),
      getAccountMeta("campaign", accounts.campaign),
      getAccountMeta("leverMint", accounts.leverMint),
      getAccountMeta("airdropVault", accounts.airdropVault),
      getAccountMeta("destination", accounts.destination),
      getAccountMeta("leverProgram", accounts.leverProgram)
    ],
    data: getReclaimAirdropInstructionDataEncoder().encode({}),
    programAddress
  });
}
function parseReclaimAirdropInstruction(instruction) {
  if (instruction.accounts.length < 7) {
    throw new SolanaError7(
      SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS7,
      {
        actualAccountMetas: instruction.accounts.length,
        expectedAccountMetas: 7
      }
    );
  }
  let accountIndex = 0;
  const getNextAccount = () => {
    const accountMeta = instruction.accounts[accountIndex];
    accountIndex += 1;
    return accountMeta;
  };
  return {
    programAddress: instruction.programAddress,
    accounts: {
      admin: getNextAccount(),
      protocol: getNextAccount(),
      campaign: getNextAccount(),
      leverMint: getNextAccount(),
      airdropVault: getNextAccount(),
      destination: getNextAccount(),
      leverProgram: getNextAccount()
    },
    data: getReclaimAirdropInstructionDataDecoder().decode(instruction.data)
  };
}

// clients/generated/instructions/requestListing.ts
import {
  combineCodec as combineCodec14,
  fixDecoderSize as fixDecoderSize13,
  fixEncoderSize as fixEncoderSize13,
  getAddressEncoder as getAddressEncoder15,
  getBytesDecoder as getBytesDecoder13,
  getBytesEncoder as getBytesEncoder21,
  getProgramDerivedAddress as getProgramDerivedAddress9,
  getStructDecoder as getStructDecoder14,
  getStructEncoder as getStructEncoder14,
  getU64Decoder as getU64Decoder9,
  getU64Encoder as getU64Encoder9,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS8,
  SolanaError as SolanaError8,
  transformEncoder as transformEncoder13
} from "@solana/kit";
import {
  getAccountMetaFactory as getAccountMetaFactory8,
  getAddressFromResolvedInstructionAccount as getAddressFromResolvedInstructionAccount8
} from "@solana/kit/program-client-core";
var REQUEST_LISTING_DISCRIMINATOR = new Uint8Array(
  [2, 167, 98, 66, 122, 255, 254, 216]
);
function getRequestListingDiscriminatorBytes() {
  return fixEncoderSize13(getBytesEncoder21(), 8).encode(
    REQUEST_LISTING_DISCRIMINATOR
  );
}
function getRequestListingInstructionDataEncoder() {
  return transformEncoder13(
    getStructEncoder14([
      ["discriminator", fixEncoderSize13(getBytesEncoder21(), 8)],
      ["solLamports", getU64Encoder9()],
      ["tokenAmount", getU64Encoder9()]
    ]),
    (value) => ({ ...value, discriminator: REQUEST_LISTING_DISCRIMINATOR })
  );
}
function getRequestListingInstructionDataDecoder() {
  return getStructDecoder14([
    ["discriminator", fixDecoderSize13(getBytesDecoder13(), 8)],
    ["solLamports", getU64Decoder9()],
    ["tokenAmount", getU64Decoder9()]
  ]);
}
function getRequestListingInstructionDataCodec() {
  return combineCodec14(
    getRequestListingInstructionDataEncoder(),
    getRequestListingInstructionDataDecoder()
  );
}
async function getRequestListingInstructionAsync(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory8(programAddress, "programId");
  const originalAccounts = {
    lister: { value: input.lister ?? null, isSigner: true, isWritable: true },
    protocol: {
      value: input.protocol ?? null,
      isSigner: false,
      isWritable: true
    },
    reviewer: {
      value: input.reviewer ?? null,
      isSigner: true,
      isWritable: false
    },
    listing: {
      value: input.listing ?? null,
      isSigner: false,
      isWritable: true
    },
    baseMint: {
      value: input.baseMint ?? null,
      isSigner: false,
      isWritable: false
    },
    pumpCurve: {
      value: input.pumpCurve ?? null,
      isSigner: false,
      isWritable: false
    },
    leverMint: {
      value: input.leverMint ?? null,
      isSigner: false,
      isWritable: true
    },
    leverSource: {
      value: input.leverSource ?? null,
      isSigner: false,
      isWritable: true
    },
    baseSource: {
      value: input.baseSource ?? null,
      isSigner: false,
      isWritable: true
    },
    baseVault: {
      value: input.baseVault ?? null,
      isSigner: false,
      isWritable: true
    },
    leverProgram: {
      value: input.leverProgram ?? null,
      isSigner: false,
      isWritable: false
    },
    baseProgram: {
      value: input.baseProgram ?? null,
      isSigner: false,
      isWritable: false
    },
    systemProgram: {
      value: input.systemProgram ?? null,
      isSigner: false,
      isWritable: false
    }
  };
  const accounts = originalAccounts;
  const args = { ...input };
  if (!accounts.listing.value) {
    accounts.listing.value = await findListingPda(
      {
        protocol: getAddressFromResolvedInstructionAccount8(
          "protocol",
          accounts.protocol.value
        ),
        baseMint: getAddressFromResolvedInstructionAccount8(
          "baseMint",
          accounts.baseMint.value
        )
      },
      { programAddress }
    );
  }
  if (!accounts.pumpCurve.value) {
    accounts.pumpCurve.value = await getProgramDerivedAddress9({
      programAddress: "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P",
      seeds: [
        getBytesEncoder21().encode(
          new Uint8Array([
            98,
            111,
            110,
            100,
            105,
            110,
            103,
            45,
            99,
            117,
            114,
            118,
            101
          ])
        ),
        getAddressEncoder15().encode(
          getAddressFromResolvedInstructionAccount8(
            "baseMint",
            accounts.baseMint.value
          )
        )
      ]
    });
  }
  if (!accounts.baseVault.value) {
    accounts.baseVault.value = await findBaseVaultPda(
      {
        listing: getAddressFromResolvedInstructionAccount8(
          "listing",
          accounts.listing.value
        )
      },
      { programAddress }
    );
  }
  if (!accounts.systemProgram.value) {
    accounts.systemProgram.value = "11111111111111111111111111111111";
  }
  return Object.freeze({
    accounts: [
      getAccountMeta("lister", accounts.lister),
      getAccountMeta("protocol", accounts.protocol),
      getAccountMeta("reviewer", accounts.reviewer),
      getAccountMeta("listing", accounts.listing),
      getAccountMeta("baseMint", accounts.baseMint),
      getAccountMeta("pumpCurve", accounts.pumpCurve),
      getAccountMeta("leverMint", accounts.leverMint),
      getAccountMeta("leverSource", accounts.leverSource),
      getAccountMeta("baseSource", accounts.baseSource),
      getAccountMeta("baseVault", accounts.baseVault),
      getAccountMeta("leverProgram", accounts.leverProgram),
      getAccountMeta("baseProgram", accounts.baseProgram),
      getAccountMeta("systemProgram", accounts.systemProgram)
    ],
    data: getRequestListingInstructionDataEncoder().encode(
      args
    ),
    programAddress
  });
}
function getRequestListingInstruction(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory8(programAddress, "programId");
  const originalAccounts = {
    lister: { value: input.lister ?? null, isSigner: true, isWritable: true },
    protocol: {
      value: input.protocol ?? null,
      isSigner: false,
      isWritable: true
    },
    reviewer: {
      value: input.reviewer ?? null,
      isSigner: true,
      isWritable: false
    },
    listing: {
      value: input.listing ?? null,
      isSigner: false,
      isWritable: true
    },
    baseMint: {
      value: input.baseMint ?? null,
      isSigner: false,
      isWritable: false
    },
    pumpCurve: {
      value: input.pumpCurve ?? null,
      isSigner: false,
      isWritable: false
    },
    leverMint: {
      value: input.leverMint ?? null,
      isSigner: false,
      isWritable: true
    },
    leverSource: {
      value: input.leverSource ?? null,
      isSigner: false,
      isWritable: true
    },
    baseSource: {
      value: input.baseSource ?? null,
      isSigner: false,
      isWritable: true
    },
    baseVault: {
      value: input.baseVault ?? null,
      isSigner: false,
      isWritable: true
    },
    leverProgram: {
      value: input.leverProgram ?? null,
      isSigner: false,
      isWritable: false
    },
    baseProgram: {
      value: input.baseProgram ?? null,
      isSigner: false,
      isWritable: false
    },
    systemProgram: {
      value: input.systemProgram ?? null,
      isSigner: false,
      isWritable: false
    }
  };
  const accounts = originalAccounts;
  const args = { ...input };
  if (!accounts.systemProgram.value) {
    accounts.systemProgram.value = "11111111111111111111111111111111";
  }
  return Object.freeze({
    accounts: [
      getAccountMeta("lister", accounts.lister),
      getAccountMeta("protocol", accounts.protocol),
      getAccountMeta("reviewer", accounts.reviewer),
      getAccountMeta("listing", accounts.listing),
      getAccountMeta("baseMint", accounts.baseMint),
      getAccountMeta("pumpCurve", accounts.pumpCurve),
      getAccountMeta("leverMint", accounts.leverMint),
      getAccountMeta("leverSource", accounts.leverSource),
      getAccountMeta("baseSource", accounts.baseSource),
      getAccountMeta("baseVault", accounts.baseVault),
      getAccountMeta("leverProgram", accounts.leverProgram),
      getAccountMeta("baseProgram", accounts.baseProgram),
      getAccountMeta("systemProgram", accounts.systemProgram)
    ],
    data: getRequestListingInstructionDataEncoder().encode(
      args
    ),
    programAddress
  });
}
function parseRequestListingInstruction(instruction) {
  if (instruction.accounts.length < 13) {
    throw new SolanaError8(
      SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS8,
      {
        actualAccountMetas: instruction.accounts.length,
        expectedAccountMetas: 13
      }
    );
  }
  let accountIndex = 0;
  const getNextAccount = () => {
    const accountMeta = instruction.accounts[accountIndex];
    accountIndex += 1;
    return accountMeta;
  };
  return {
    programAddress: instruction.programAddress,
    accounts: {
      lister: getNextAccount(),
      protocol: getNextAccount(),
      reviewer: getNextAccount(),
      listing: getNextAccount(),
      baseMint: getNextAccount(),
      pumpCurve: getNextAccount(),
      leverMint: getNextAccount(),
      leverSource: getNextAccount(),
      baseSource: getNextAccount(),
      baseVault: getNextAccount(),
      leverProgram: getNextAccount(),
      baseProgram: getNextAccount(),
      systemProgram: getNextAccount()
    },
    data: getRequestListingInstructionDataDecoder().decode(instruction.data)
  };
}

// clients/generated/instructions/routePlatformRevenue.ts
import {
  combineCodec as combineCodec15,
  fixDecoderSize as fixDecoderSize14,
  fixEncoderSize as fixEncoderSize14,
  getBytesDecoder as getBytesDecoder14,
  getBytesEncoder as getBytesEncoder22,
  getStructDecoder as getStructDecoder15,
  getStructEncoder as getStructEncoder15,
  getU64Decoder as getU64Decoder10,
  getU64Encoder as getU64Encoder10,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS9,
  SolanaError as SolanaError9,
  transformEncoder as transformEncoder14
} from "@solana/kit";
import {
  getAccountMetaFactory as getAccountMetaFactory9
} from "@solana/kit/program-client-core";
var ROUTE_PLATFORM_REVENUE_DISCRIMINATOR = new Uint8Array([72, 200, 22, 148, 177, 183, 136, 29]);
function getRoutePlatformRevenueDiscriminatorBytes() {
  return fixEncoderSize14(getBytesEncoder22(), 8).encode(
    ROUTE_PLATFORM_REVENUE_DISCRIMINATOR
  );
}
function getRoutePlatformRevenueInstructionDataEncoder() {
  return transformEncoder14(
    getStructEncoder15([
      ["discriminator", fixEncoderSize14(getBytesEncoder22(), 8)],
      ["amount", getU64Encoder10()]
    ]),
    (value) => ({
      ...value,
      discriminator: ROUTE_PLATFORM_REVENUE_DISCRIMINATOR
    })
  );
}
function getRoutePlatformRevenueInstructionDataDecoder() {
  return getStructDecoder15([
    ["discriminator", fixDecoderSize14(getBytesDecoder14(), 8)],
    ["amount", getU64Decoder10()]
  ]);
}
function getRoutePlatformRevenueInstructionDataCodec() {
  return combineCodec15(
    getRoutePlatformRevenueInstructionDataEncoder(),
    getRoutePlatformRevenueInstructionDataDecoder()
  );
}
function getRoutePlatformRevenueInstruction(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory9(programAddress, "programId");
  const originalAccounts = {
    admin: { value: input.admin ?? null, isSigner: true, isWritable: false },
    protocol: {
      value: input.protocol ?? null,
      isSigner: false,
      isWritable: true
    },
    listing: {
      value: input.listing ?? null,
      isSigner: false,
      isWritable: false
    },
    quoteMint: {
      value: input.quoteMint ?? null,
      isSigner: false,
      isWritable: false
    },
    source: { value: input.source ?? null, isSigner: false, isWritable: true },
    treasury: {
      value: input.treasury ?? null,
      isSigner: false,
      isWritable: true
    },
    campaignFund: {
      value: input.campaignFund ?? null,
      isSigner: false,
      isWritable: true
    },
    creator: {
      value: input.creator ?? null,
      isSigner: false,
      isWritable: true
    },
    buybackFund: {
      value: input.buybackFund ?? null,
      isSigner: false,
      isWritable: true
    },
    quoteProgram: {
      value: input.quoteProgram ?? null,
      isSigner: false,
      isWritable: false
    }
  };
  const accounts = originalAccounts;
  const args = { ...input };
  return Object.freeze({
    accounts: [
      getAccountMeta("admin", accounts.admin),
      getAccountMeta("protocol", accounts.protocol),
      getAccountMeta("listing", accounts.listing),
      getAccountMeta("quoteMint", accounts.quoteMint),
      getAccountMeta("source", accounts.source),
      getAccountMeta("treasury", accounts.treasury),
      getAccountMeta("campaignFund", accounts.campaignFund),
      getAccountMeta("creator", accounts.creator),
      getAccountMeta("buybackFund", accounts.buybackFund),
      getAccountMeta("quoteProgram", accounts.quoteProgram)
    ],
    data: getRoutePlatformRevenueInstructionDataEncoder().encode(
      args
    ),
    programAddress
  });
}
function parseRoutePlatformRevenueInstruction(instruction) {
  if (instruction.accounts.length < 10) {
    throw new SolanaError9(
      SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS9,
      {
        actualAccountMetas: instruction.accounts.length,
        expectedAccountMetas: 10
      }
    );
  }
  let accountIndex = 0;
  const getNextAccount = () => {
    const accountMeta = instruction.accounts[accountIndex];
    accountIndex += 1;
    return accountMeta;
  };
  return {
    programAddress: instruction.programAddress,
    accounts: {
      admin: getNextAccount(),
      protocol: getNextAccount(),
      listing: getNextAccount(),
      quoteMint: getNextAccount(),
      source: getNextAccount(),
      treasury: getNextAccount(),
      campaignFund: getNextAccount(),
      creator: getNextAccount(),
      buybackFund: getNextAccount(),
      quoteProgram: getNextAccount()
    },
    data: getRoutePlatformRevenueInstructionDataDecoder().decode(
      instruction.data
    )
  };
}

// clients/generated/instructions/routeTokenCreatorRevenue.ts
import {
  combineCodec as combineCodec16,
  fixDecoderSize as fixDecoderSize15,
  fixEncoderSize as fixEncoderSize15,
  getBytesDecoder as getBytesDecoder15,
  getBytesEncoder as getBytesEncoder23,
  getStructDecoder as getStructDecoder16,
  getStructEncoder as getStructEncoder16,
  getU64Decoder as getU64Decoder11,
  getU64Encoder as getU64Encoder11,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS10,
  SolanaError as SolanaError10,
  transformEncoder as transformEncoder15
} from "@solana/kit";
import {
  getAccountMetaFactory as getAccountMetaFactory10
} from "@solana/kit/program-client-core";
var ROUTE_TOKEN_CREATOR_REVENUE_DISCRIMINATOR = new Uint8Array([248, 247, 236, 188, 45, 130, 117, 221]);
function getRouteTokenCreatorRevenueDiscriminatorBytes() {
  return fixEncoderSize15(getBytesEncoder23(), 8).encode(
    ROUTE_TOKEN_CREATOR_REVENUE_DISCRIMINATOR
  );
}
function getRouteTokenCreatorRevenueInstructionDataEncoder() {
  return transformEncoder15(
    getStructEncoder16([
      ["discriminator", fixEncoderSize15(getBytesEncoder23(), 8)],
      ["amount", getU64Encoder11()]
    ]),
    (value) => ({
      ...value,
      discriminator: ROUTE_TOKEN_CREATOR_REVENUE_DISCRIMINATOR
    })
  );
}
function getRouteTokenCreatorRevenueInstructionDataDecoder() {
  return getStructDecoder16([
    ["discriminator", fixDecoderSize15(getBytesDecoder15(), 8)],
    ["amount", getU64Decoder11()]
  ]);
}
function getRouteTokenCreatorRevenueInstructionDataCodec() {
  return combineCodec16(
    getRouteTokenCreatorRevenueInstructionDataEncoder(),
    getRouteTokenCreatorRevenueInstructionDataDecoder()
  );
}
function getRouteTokenCreatorRevenueInstruction(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory10(programAddress, "programId");
  const originalAccounts = {
    admin: { value: input.admin ?? null, isSigner: true, isWritable: false },
    protocol: {
      value: input.protocol ?? null,
      isSigner: false,
      isWritable: true
    },
    quoteMint: {
      value: input.quoteMint ?? null,
      isSigner: false,
      isWritable: false
    },
    source: { value: input.source ?? null, isSigner: false, isWritable: true },
    treasury: {
      value: input.treasury ?? null,
      isSigner: false,
      isWritable: true
    },
    buybackFund: {
      value: input.buybackFund ?? null,
      isSigner: false,
      isWritable: true
    },
    quoteProgram: {
      value: input.quoteProgram ?? null,
      isSigner: false,
      isWritable: false
    }
  };
  const accounts = originalAccounts;
  const args = { ...input };
  return Object.freeze({
    accounts: [
      getAccountMeta("admin", accounts.admin),
      getAccountMeta("protocol", accounts.protocol),
      getAccountMeta("quoteMint", accounts.quoteMint),
      getAccountMeta("source", accounts.source),
      getAccountMeta("treasury", accounts.treasury),
      getAccountMeta("buybackFund", accounts.buybackFund),
      getAccountMeta("quoteProgram", accounts.quoteProgram)
    ],
    data: getRouteTokenCreatorRevenueInstructionDataEncoder().encode(
      args
    ),
    programAddress
  });
}
function parseRouteTokenCreatorRevenueInstruction(instruction) {
  if (instruction.accounts.length < 7) {
    throw new SolanaError10(
      SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS10,
      {
        actualAccountMetas: instruction.accounts.length,
        expectedAccountMetas: 7
      }
    );
  }
  let accountIndex = 0;
  const getNextAccount = () => {
    const accountMeta = instruction.accounts[accountIndex];
    accountIndex += 1;
    return accountMeta;
  };
  return {
    programAddress: instruction.programAddress,
    accounts: {
      admin: getNextAccount(),
      protocol: getNextAccount(),
      quoteMint: getNextAccount(),
      source: getNextAccount(),
      treasury: getNextAccount(),
      buybackFund: getNextAccount(),
      quoteProgram: getNextAccount()
    },
    data: getRouteTokenCreatorRevenueInstructionDataDecoder().decode(
      instruction.data
    )
  };
}

// clients/generated/instructions/setListingApproved.ts
import {
  combineCodec as combineCodec17,
  fixDecoderSize as fixDecoderSize16,
  fixEncoderSize as fixEncoderSize16,
  getBooleanDecoder as getBooleanDecoder4,
  getBooleanEncoder as getBooleanEncoder4,
  getBytesDecoder as getBytesDecoder16,
  getBytesEncoder as getBytesEncoder24,
  getStructDecoder as getStructDecoder17,
  getStructEncoder as getStructEncoder17,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS11,
  SolanaError as SolanaError11,
  transformEncoder as transformEncoder16
} from "@solana/kit";
import {
  getAccountMetaFactory as getAccountMetaFactory11
} from "@solana/kit/program-client-core";
var SET_LISTING_APPROVED_DISCRIMINATOR = new Uint8Array([199, 59, 208, 95, 38, 69, 168, 183]);
function getSetListingApprovedDiscriminatorBytes() {
  return fixEncoderSize16(getBytesEncoder24(), 8).encode(
    SET_LISTING_APPROVED_DISCRIMINATOR
  );
}
function getSetListingApprovedInstructionDataEncoder() {
  return transformEncoder16(
    getStructEncoder17([
      ["discriminator", fixEncoderSize16(getBytesEncoder24(), 8)],
      ["approved", getBooleanEncoder4()]
    ]),
    (value) => ({
      ...value,
      discriminator: SET_LISTING_APPROVED_DISCRIMINATOR
    })
  );
}
function getSetListingApprovedInstructionDataDecoder() {
  return getStructDecoder17([
    ["discriminator", fixDecoderSize16(getBytesDecoder16(), 8)],
    ["approved", getBooleanDecoder4()]
  ]);
}
function getSetListingApprovedInstructionDataCodec() {
  return combineCodec17(
    getSetListingApprovedInstructionDataEncoder(),
    getSetListingApprovedInstructionDataDecoder()
  );
}
function getSetListingApprovedInstruction(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory11(programAddress, "programId");
  const originalAccounts = {
    admin: { value: input.admin ?? null, isSigner: true, isWritable: false },
    protocol: {
      value: input.protocol ?? null,
      isSigner: false,
      isWritable: false
    },
    listing: {
      value: input.listing ?? null,
      isSigner: false,
      isWritable: true
    }
  };
  const accounts = originalAccounts;
  const args = { ...input };
  return Object.freeze({
    accounts: [
      getAccountMeta("admin", accounts.admin),
      getAccountMeta("protocol", accounts.protocol),
      getAccountMeta("listing", accounts.listing)
    ],
    data: getSetListingApprovedInstructionDataEncoder().encode(
      args
    ),
    programAddress
  });
}
function parseSetListingApprovedInstruction(instruction) {
  if (instruction.accounts.length < 3) {
    throw new SolanaError11(
      SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS11,
      {
        actualAccountMetas: instruction.accounts.length,
        expectedAccountMetas: 3
      }
    );
  }
  let accountIndex = 0;
  const getNextAccount = () => {
    const accountMeta = instruction.accounts[accountIndex];
    accountIndex += 1;
    return accountMeta;
  };
  return {
    programAddress: instruction.programAddress,
    accounts: {
      admin: getNextAccount(),
      protocol: getNextAccount(),
      listing: getNextAccount()
    },
    data: getSetListingApprovedInstructionDataDecoder().decode(
      instruction.data
    )
  };
}

// clients/generated/instructions/setPaused.ts
import {
  combineCodec as combineCodec18,
  fixDecoderSize as fixDecoderSize17,
  fixEncoderSize as fixEncoderSize17,
  getBooleanDecoder as getBooleanDecoder5,
  getBooleanEncoder as getBooleanEncoder5,
  getBytesDecoder as getBytesDecoder17,
  getBytesEncoder as getBytesEncoder25,
  getStructDecoder as getStructDecoder18,
  getStructEncoder as getStructEncoder18,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS12,
  SolanaError as SolanaError12,
  transformEncoder as transformEncoder17
} from "@solana/kit";
import {
  getAccountMetaFactory as getAccountMetaFactory12
} from "@solana/kit/program-client-core";
var SET_PAUSED_DISCRIMINATOR = new Uint8Array([
  91,
  60,
  125,
  192,
  176,
  225,
  166,
  218
]);
function getSetPausedDiscriminatorBytes() {
  return fixEncoderSize17(getBytesEncoder25(), 8).encode(SET_PAUSED_DISCRIMINATOR);
}
function getSetPausedInstructionDataEncoder() {
  return transformEncoder17(
    getStructEncoder18([
      ["discriminator", fixEncoderSize17(getBytesEncoder25(), 8)],
      ["paused", getBooleanEncoder5()]
    ]),
    (value) => ({ ...value, discriminator: SET_PAUSED_DISCRIMINATOR })
  );
}
function getSetPausedInstructionDataDecoder() {
  return getStructDecoder18([
    ["discriminator", fixDecoderSize17(getBytesDecoder17(), 8)],
    ["paused", getBooleanDecoder5()]
  ]);
}
function getSetPausedInstructionDataCodec() {
  return combineCodec18(
    getSetPausedInstructionDataEncoder(),
    getSetPausedInstructionDataDecoder()
  );
}
function getSetPausedInstruction(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory12(programAddress, "programId");
  const originalAccounts = {
    admin: { value: input.admin ?? null, isSigner: true, isWritable: false },
    protocol: {
      value: input.protocol ?? null,
      isSigner: false,
      isWritable: true
    }
  };
  const accounts = originalAccounts;
  const args = { ...input };
  return Object.freeze({
    accounts: [
      getAccountMeta("admin", accounts.admin),
      getAccountMeta("protocol", accounts.protocol)
    ],
    data: getSetPausedInstructionDataEncoder().encode(
      args
    ),
    programAddress
  });
}
function parseSetPausedInstruction(instruction) {
  if (instruction.accounts.length < 2) {
    throw new SolanaError12(
      SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS12,
      {
        actualAccountMetas: instruction.accounts.length,
        expectedAccountMetas: 2
      }
    );
  }
  let accountIndex = 0;
  const getNextAccount = () => {
    const accountMeta = instruction.accounts[accountIndex];
    accountIndex += 1;
    return accountMeta;
  };
  return {
    programAddress: instruction.programAddress,
    accounts: { admin: getNextAccount(), protocol: getNextAccount() },
    data: getSetPausedInstructionDataDecoder().decode(instruction.data)
  };
}

// clients/generated/instructions/withdraw.ts
import {
  combineCodec as combineCodec19,
  fixDecoderSize as fixDecoderSize18,
  fixEncoderSize as fixEncoderSize18,
  getBytesDecoder as getBytesDecoder18,
  getBytesEncoder as getBytesEncoder26,
  getStructDecoder as getStructDecoder19,
  getStructEncoder as getStructEncoder19,
  getU64Decoder as getU64Decoder12,
  getU64Encoder as getU64Encoder12,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS13,
  SolanaError as SolanaError13,
  transformEncoder as transformEncoder18
} from "@solana/kit";
import {
  getAccountMetaFactory as getAccountMetaFactory13,
  getAddressFromResolvedInstructionAccount as getAddressFromResolvedInstructionAccount9
} from "@solana/kit/program-client-core";
var WITHDRAW_DISCRIMINATOR = new Uint8Array([
  183,
  18,
  70,
  156,
  148,
  109,
  161,
  34
]);
function getWithdrawDiscriminatorBytes() {
  return fixEncoderSize18(getBytesEncoder26(), 8).encode(WITHDRAW_DISCRIMINATOR);
}
function getWithdrawInstructionDataEncoder() {
  return transformEncoder18(
    getStructEncoder19([
      ["discriminator", fixEncoderSize18(getBytesEncoder26(), 8)],
      ["amount", getU64Encoder12()]
    ]),
    (value) => ({ ...value, discriminator: WITHDRAW_DISCRIMINATOR })
  );
}
function getWithdrawInstructionDataDecoder() {
  return getStructDecoder19([
    ["discriminator", fixDecoderSize18(getBytesDecoder18(), 8)],
    ["amount", getU64Decoder12()]
  ]);
}
function getWithdrawInstructionDataCodec() {
  return combineCodec19(
    getWithdrawInstructionDataEncoder(),
    getWithdrawInstructionDataDecoder()
  );
}
async function getWithdrawInstructionAsync(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory13(programAddress, "programId");
  const originalAccounts = {
    owner: { value: input.owner ?? null, isSigner: true, isWritable: false },
    protocol: {
      value: input.protocol ?? null,
      isSigner: false,
      isWritable: false
    },
    margin: { value: input.margin ?? null, isSigner: false, isWritable: true },
    quoteMint: {
      value: input.quoteMint ?? null,
      isSigner: false,
      isWritable: false
    },
    destination: {
      value: input.destination ?? null,
      isSigner: false,
      isWritable: true
    },
    quoteVault: {
      value: input.quoteVault ?? null,
      isSigner: false,
      isWritable: true
    },
    quoteProgram: {
      value: input.quoteProgram ?? null,
      isSigner: false,
      isWritable: false
    }
  };
  const accounts = originalAccounts;
  const args = { ...input };
  if (!accounts.margin.value) {
    accounts.margin.value = await findMarginPda(
      {
        protocol: getAddressFromResolvedInstructionAccount9(
          "protocol",
          accounts.protocol.value
        ),
        owner: getAddressFromResolvedInstructionAccount9(
          "owner",
          accounts.owner.value
        )
      },
      { programAddress }
    );
  }
  if (!accounts.quoteVault.value) {
    accounts.quoteVault.value = await findQuoteVaultPda(
      {
        margin: getAddressFromResolvedInstructionAccount9(
          "margin",
          accounts.margin.value
        )
      },
      { programAddress }
    );
  }
  return Object.freeze({
    accounts: [
      getAccountMeta("owner", accounts.owner),
      getAccountMeta("protocol", accounts.protocol),
      getAccountMeta("margin", accounts.margin),
      getAccountMeta("quoteMint", accounts.quoteMint),
      getAccountMeta("destination", accounts.destination),
      getAccountMeta("quoteVault", accounts.quoteVault),
      getAccountMeta("quoteProgram", accounts.quoteProgram)
    ],
    data: getWithdrawInstructionDataEncoder().encode(
      args
    ),
    programAddress
  });
}
function getWithdrawInstruction(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory13(programAddress, "programId");
  const originalAccounts = {
    owner: { value: input.owner ?? null, isSigner: true, isWritable: false },
    protocol: {
      value: input.protocol ?? null,
      isSigner: false,
      isWritable: false
    },
    margin: { value: input.margin ?? null, isSigner: false, isWritable: true },
    quoteMint: {
      value: input.quoteMint ?? null,
      isSigner: false,
      isWritable: false
    },
    destination: {
      value: input.destination ?? null,
      isSigner: false,
      isWritable: true
    },
    quoteVault: {
      value: input.quoteVault ?? null,
      isSigner: false,
      isWritable: true
    },
    quoteProgram: {
      value: input.quoteProgram ?? null,
      isSigner: false,
      isWritable: false
    }
  };
  const accounts = originalAccounts;
  const args = { ...input };
  return Object.freeze({
    accounts: [
      getAccountMeta("owner", accounts.owner),
      getAccountMeta("protocol", accounts.protocol),
      getAccountMeta("margin", accounts.margin),
      getAccountMeta("quoteMint", accounts.quoteMint),
      getAccountMeta("destination", accounts.destination),
      getAccountMeta("quoteVault", accounts.quoteVault),
      getAccountMeta("quoteProgram", accounts.quoteProgram)
    ],
    data: getWithdrawInstructionDataEncoder().encode(
      args
    ),
    programAddress
  });
}
function parseWithdrawInstruction(instruction) {
  if (instruction.accounts.length < 7) {
    throw new SolanaError13(
      SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS13,
      {
        actualAccountMetas: instruction.accounts.length,
        expectedAccountMetas: 7
      }
    );
  }
  let accountIndex = 0;
  const getNextAccount = () => {
    const accountMeta = instruction.accounts[accountIndex];
    accountIndex += 1;
    return accountMeta;
  };
  return {
    programAddress: instruction.programAddress,
    accounts: {
      owner: getNextAccount(),
      protocol: getNextAccount(),
      margin: getNextAccount(),
      quoteMint: getNextAccount(),
      destination: getNextAccount(),
      quoteVault: getNextAccount(),
      quoteProgram: getNextAccount()
    },
    data: getWithdrawInstructionDataDecoder().decode(instruction.data)
  };
}

// clients/generated/programs/levermeme.ts
var LEVERMEME_PROGRAM_ADDRESS = "Fg6PaFpoGXkYsidMpWxTWqkZ7FEfcYkgMQhgS1h5A9t";
var LevermemeAccount = /* @__PURE__ */ ((LevermemeAccount2) => {
  LevermemeAccount2[LevermemeAccount2["AirdropCampaign"] = 0] = "AirdropCampaign";
  LevermemeAccount2[LevermemeAccount2["AirdropClaim"] = 1] = "AirdropClaim";
  LevermemeAccount2[LevermemeAccount2["Listing"] = 2] = "Listing";
  LevermemeAccount2[LevermemeAccount2["MarginAccount"] = 3] = "MarginAccount";
  LevermemeAccount2[LevermemeAccount2["Protocol"] = 4] = "Protocol";
  return LevermemeAccount2;
})(LevermemeAccount || {});
function identifyLevermemeAccount(account) {
  const data = "data" in account ? account.data : account;
  if (containsBytes(
    data,
    fixEncoderSize19(getBytesEncoder27(), 8).encode(
      new Uint8Array([235, 102, 51, 70, 37, 179, 248, 13])
    ),
    0
  )) {
    return 0 /* AirdropCampaign */;
  }
  if (containsBytes(
    data,
    fixEncoderSize19(getBytesEncoder27(), 8).encode(
      new Uint8Array([231, 12, 74, 54, 245, 181, 248, 38])
    ),
    0
  )) {
    return 1 /* AirdropClaim */;
  }
  if (containsBytes(
    data,
    fixEncoderSize19(getBytesEncoder27(), 8).encode(
      new Uint8Array([218, 32, 50, 73, 43, 134, 26, 58])
    ),
    0
  )) {
    return 2 /* Listing */;
  }
  if (containsBytes(
    data,
    fixEncoderSize19(getBytesEncoder27(), 8).encode(
      new Uint8Array([133, 220, 173, 213, 179, 211, 43, 238])
    ),
    0
  )) {
    return 3 /* MarginAccount */;
  }
  if (containsBytes(
    data,
    fixEncoderSize19(getBytesEncoder27(), 8).encode(
      new Uint8Array([45, 39, 101, 43, 115, 72, 131, 40])
    ),
    0
  )) {
    return 4 /* Protocol */;
  }
  throw new SolanaError14(
    SOLANA_ERROR__PROGRAM_CLIENTS__FAILED_TO_IDENTIFY_ACCOUNT,
    { accountData: data, programName: "levermeme" }
  );
}
var LevermemeEvent = /* @__PURE__ */ ((LevermemeEvent2) => {
  LevermemeEvent2[LevermemeEvent2["AirdropClaimed"] = 0] = "AirdropClaimed";
  LevermemeEvent2[LevermemeEvent2["AirdropCreated"] = 1] = "AirdropCreated";
  LevermemeEvent2[LevermemeEvent2["CollateralChanged"] = 2] = "CollateralChanged";
  LevermemeEvent2[LevermemeEvent2["ListingCancelled"] = 3] = "ListingCancelled";
  LevermemeEvent2[LevermemeEvent2["ListingRequested"] = 4] = "ListingRequested";
  LevermemeEvent2[LevermemeEvent2["ListingReviewed"] = 5] = "ListingReviewed";
  LevermemeEvent2[LevermemeEvent2["PauseChanged"] = 6] = "PauseChanged";
  LevermemeEvent2[LevermemeEvent2["ProtocolCreated"] = 7] = "ProtocolCreated";
  LevermemeEvent2[LevermemeEvent2["RevenueRouted"] = 8] = "RevenueRouted";
  return LevermemeEvent2;
})(LevermemeEvent || {});
function identifyLevermemeEvent(event) {
  const data = "data" in event ? event.data : event;
  if (containsBytes(
    data,
    fixEncoderSize19(getBytesEncoder27(), 8).encode(
      new Uint8Array([125, 251, 195, 183, 202, 126, 89, 68])
    ),
    0
  )) {
    return 0 /* AirdropClaimed */;
  }
  if (containsBytes(
    data,
    fixEncoderSize19(getBytesEncoder27(), 8).encode(
      new Uint8Array([190, 219, 101, 33, 208, 187, 149, 96])
    ),
    0
  )) {
    return 1 /* AirdropCreated */;
  }
  if (containsBytes(
    data,
    fixEncoderSize19(getBytesEncoder27(), 8).encode(
      new Uint8Array([172, 114, 48, 57, 98, 83, 95, 157])
    ),
    0
  )) {
    return 2 /* CollateralChanged */;
  }
  if (containsBytes(
    data,
    fixEncoderSize19(getBytesEncoder27(), 8).encode(
      new Uint8Array([11, 46, 163, 10, 103, 80, 139, 194])
    ),
    0
  )) {
    return 3 /* ListingCancelled */;
  }
  if (containsBytes(
    data,
    fixEncoderSize19(getBytesEncoder27(), 8).encode(
      new Uint8Array([150, 236, 30, 166, 150, 162, 210, 167])
    ),
    0
  )) {
    return 4 /* ListingRequested */;
  }
  if (containsBytes(
    data,
    fixEncoderSize19(getBytesEncoder27(), 8).encode(
      new Uint8Array([33, 226, 137, 167, 158, 100, 9, 238])
    ),
    0
  )) {
    return 5 /* ListingReviewed */;
  }
  if (containsBytes(
    data,
    fixEncoderSize19(getBytesEncoder27(), 8).encode(
      new Uint8Array([238, 188, 213, 78, 134, 209, 178, 218])
    ),
    0
  )) {
    return 6 /* PauseChanged */;
  }
  if (containsBytes(
    data,
    fixEncoderSize19(getBytesEncoder27(), 8).encode(
      new Uint8Array([15, 251, 247, 158, 97, 201, 1, 226])
    ),
    0
  )) {
    return 7 /* ProtocolCreated */;
  }
  if (containsBytes(
    data,
    fixEncoderSize19(getBytesEncoder27(), 8).encode(
      new Uint8Array([57, 95, 242, 242, 222, 199, 192, 120])
    ),
    0
  )) {
    return 8 /* RevenueRouted */;
  }
  throw new Error(
    "The provided event could not be identified as a levermeme event."
  );
}
var LevermemeInstruction = /* @__PURE__ */ ((LevermemeInstruction2) => {
  LevermemeInstruction2[LevermemeInstruction2["CancelListing"] = 0] = "CancelListing";
  LevermemeInstruction2[LevermemeInstruction2["ClaimAirdrop"] = 1] = "ClaimAirdrop";
  LevermemeInstruction2[LevermemeInstruction2["CreateAirdrop"] = 2] = "CreateAirdrop";
  LevermemeInstruction2[LevermemeInstruction2["Deposit"] = 3] = "Deposit";
  LevermemeInstruction2[LevermemeInstruction2["InitializeProtocol"] = 4] = "InitializeProtocol";
  LevermemeInstruction2[LevermemeInstruction2["OpenMarginAccount"] = 5] = "OpenMarginAccount";
  LevermemeInstruction2[LevermemeInstruction2["ReclaimAirdrop"] = 6] = "ReclaimAirdrop";
  LevermemeInstruction2[LevermemeInstruction2["RequestListing"] = 7] = "RequestListing";
  LevermemeInstruction2[LevermemeInstruction2["RoutePlatformRevenue"] = 8] = "RoutePlatformRevenue";
  LevermemeInstruction2[LevermemeInstruction2["RouteTokenCreatorRevenue"] = 9] = "RouteTokenCreatorRevenue";
  LevermemeInstruction2[LevermemeInstruction2["SetListingApproved"] = 10] = "SetListingApproved";
  LevermemeInstruction2[LevermemeInstruction2["SetPaused"] = 11] = "SetPaused";
  LevermemeInstruction2[LevermemeInstruction2["Withdraw"] = 12] = "Withdraw";
  return LevermemeInstruction2;
})(LevermemeInstruction || {});
function identifyLevermemeInstruction(instruction) {
  const data = "data" in instruction ? instruction.data : instruction;
  if (containsBytes(
    data,
    fixEncoderSize19(getBytesEncoder27(), 8).encode(
      new Uint8Array([41, 183, 50, 232, 230, 233, 157, 70])
    ),
    0
  )) {
    return 0 /* CancelListing */;
  }
  if (containsBytes(
    data,
    fixEncoderSize19(getBytesEncoder27(), 8).encode(
      new Uint8Array([137, 50, 122, 111, 89, 254, 8, 20])
    ),
    0
  )) {
    return 1 /* ClaimAirdrop */;
  }
  if (containsBytes(
    data,
    fixEncoderSize19(getBytesEncoder27(), 8).encode(
      new Uint8Array([227, 135, 208, 66, 137, 177, 80, 94])
    ),
    0
  )) {
    return 2 /* CreateAirdrop */;
  }
  if (containsBytes(
    data,
    fixEncoderSize19(getBytesEncoder27(), 8).encode(
      new Uint8Array([242, 35, 198, 137, 82, 225, 242, 182])
    ),
    0
  )) {
    return 3 /* Deposit */;
  }
  if (containsBytes(
    data,
    fixEncoderSize19(getBytesEncoder27(), 8).encode(
      new Uint8Array([188, 233, 252, 106, 134, 146, 202, 91])
    ),
    0
  )) {
    return 4 /* InitializeProtocol */;
  }
  if (containsBytes(
    data,
    fixEncoderSize19(getBytesEncoder27(), 8).encode(
      new Uint8Array([251, 54, 54, 233, 180, 125, 203, 107])
    ),
    0
  )) {
    return 5 /* OpenMarginAccount */;
  }
  if (containsBytes(
    data,
    fixEncoderSize19(getBytesEncoder27(), 8).encode(
      new Uint8Array([91, 136, 224, 68, 150, 221, 18, 207])
    ),
    0
  )) {
    return 6 /* ReclaimAirdrop */;
  }
  if (containsBytes(
    data,
    fixEncoderSize19(getBytesEncoder27(), 8).encode(
      new Uint8Array([2, 167, 98, 66, 122, 255, 254, 216])
    ),
    0
  )) {
    return 7 /* RequestListing */;
  }
  if (containsBytes(
    data,
    fixEncoderSize19(getBytesEncoder27(), 8).encode(
      new Uint8Array([72, 200, 22, 148, 177, 183, 136, 29])
    ),
    0
  )) {
    return 8 /* RoutePlatformRevenue */;
  }
  if (containsBytes(
    data,
    fixEncoderSize19(getBytesEncoder27(), 8).encode(
      new Uint8Array([248, 247, 236, 188, 45, 130, 117, 221])
    ),
    0
  )) {
    return 9 /* RouteTokenCreatorRevenue */;
  }
  if (containsBytes(
    data,
    fixEncoderSize19(getBytesEncoder27(), 8).encode(
      new Uint8Array([199, 59, 208, 95, 38, 69, 168, 183])
    ),
    0
  )) {
    return 10 /* SetListingApproved */;
  }
  if (containsBytes(
    data,
    fixEncoderSize19(getBytesEncoder27(), 8).encode(
      new Uint8Array([91, 60, 125, 192, 176, 225, 166, 218])
    ),
    0
  )) {
    return 11 /* SetPaused */;
  }
  if (containsBytes(
    data,
    fixEncoderSize19(getBytesEncoder27(), 8).encode(
      new Uint8Array([183, 18, 70, 156, 148, 109, 161, 34])
    ),
    0
  )) {
    return 12 /* Withdraw */;
  }
  throw new SolanaError14(
    SOLANA_ERROR__PROGRAM_CLIENTS__FAILED_TO_IDENTIFY_INSTRUCTION,
    { instructionData: data, programName: "levermeme" }
  );
}
function parseLevermemeInstruction(instruction) {
  const instructionType = identifyLevermemeInstruction(instruction);
  switch (instructionType) {
    case 0 /* CancelListing */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 0 /* CancelListing */,
        ...parseCancelListingInstruction(instruction)
      };
    }
    case 1 /* ClaimAirdrop */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 1 /* ClaimAirdrop */,
        ...parseClaimAirdropInstruction(instruction)
      };
    }
    case 2 /* CreateAirdrop */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 2 /* CreateAirdrop */,
        ...parseCreateAirdropInstruction(instruction)
      };
    }
    case 3 /* Deposit */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 3 /* Deposit */,
        ...parseDepositInstruction(instruction)
      };
    }
    case 4 /* InitializeProtocol */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 4 /* InitializeProtocol */,
        ...parseInitializeProtocolInstruction(instruction)
      };
    }
    case 5 /* OpenMarginAccount */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 5 /* OpenMarginAccount */,
        ...parseOpenMarginAccountInstruction(instruction)
      };
    }
    case 6 /* ReclaimAirdrop */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 6 /* ReclaimAirdrop */,
        ...parseReclaimAirdropInstruction(instruction)
      };
    }
    case 7 /* RequestListing */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 7 /* RequestListing */,
        ...parseRequestListingInstruction(instruction)
      };
    }
    case 8 /* RoutePlatformRevenue */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 8 /* RoutePlatformRevenue */,
        ...parseRoutePlatformRevenueInstruction(instruction)
      };
    }
    case 9 /* RouteTokenCreatorRevenue */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 9 /* RouteTokenCreatorRevenue */,
        ...parseRouteTokenCreatorRevenueInstruction(instruction)
      };
    }
    case 10 /* SetListingApproved */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 10 /* SetListingApproved */,
        ...parseSetListingApprovedInstruction(instruction)
      };
    }
    case 11 /* SetPaused */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 11 /* SetPaused */,
        ...parseSetPausedInstruction(instruction)
      };
    }
    case 12 /* Withdraw */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 12 /* Withdraw */,
        ...parseWithdrawInstruction(instruction)
      };
    }
    default:
      throw new SolanaError14(
        SOLANA_ERROR__PROGRAM_CLIENTS__UNRECOGNIZED_INSTRUCTION_TYPE,
        {
          instructionType,
          programName: "levermeme"
        }
      );
  }
}
function levermemeProgram(config = {}) {
  return (client) => {
    return extendClient(client, {
      levermeme: {
        accounts: {
          airdropCampaign: addSelfFetchFunctions(
            client,
            getAirdropCampaignCodec()
          ),
          airdropClaim: addSelfFetchFunctions(client, getAirdropClaimCodec()),
          listing: addSelfFetchFunctions(client, getListingCodec()),
          marginAccount: addSelfFetchFunctions(client, getMarginAccountCodec()),
          protocol: addSelfFetchFunctions(client, getProtocolCodec())
        },
        instructions: {
          cancelListing: (input, instructionConfig) => addSelfPlanAndSendFunctions(
            client,
            getCancelListingInstructionAsync(input, {
              programAddress: instructionConfig?.programAddress ?? config.programAddress
            })
          ),
          claimAirdrop: (input, instructionConfig) => addSelfPlanAndSendFunctions(
            client,
            getClaimAirdropInstructionAsync(input, {
              programAddress: instructionConfig?.programAddress ?? config.programAddress
            })
          ),
          createAirdrop: (input, instructionConfig) => addSelfPlanAndSendFunctions(
            client,
            getCreateAirdropInstructionAsync(input, {
              programAddress: instructionConfig?.programAddress ?? config.programAddress
            })
          ),
          deposit: (input, instructionConfig) => addSelfPlanAndSendFunctions(
            client,
            getDepositInstructionAsync(input, {
              programAddress: instructionConfig?.programAddress ?? config.programAddress
            })
          ),
          initializeProtocol: (input, instructionConfig) => addSelfPlanAndSendFunctions(
            client,
            getInitializeProtocolInstructionAsync(input, {
              programAddress: instructionConfig?.programAddress ?? config.programAddress
            })
          ),
          openMarginAccount: (input, instructionConfig) => addSelfPlanAndSendFunctions(
            client,
            getOpenMarginAccountInstructionAsync(input, {
              programAddress: instructionConfig?.programAddress ?? config.programAddress
            })
          ),
          reclaimAirdrop: (input, instructionConfig) => addSelfPlanAndSendFunctions(
            client,
            getReclaimAirdropInstructionAsync(input, {
              programAddress: instructionConfig?.programAddress ?? config.programAddress
            })
          ),
          requestListing: (input, instructionConfig) => addSelfPlanAndSendFunctions(
            client,
            getRequestListingInstructionAsync(input, {
              programAddress: instructionConfig?.programAddress ?? config.programAddress
            })
          ),
          routePlatformRevenue: (input, instructionConfig) => addSelfPlanAndSendFunctions(
            client,
            getRoutePlatformRevenueInstruction(input, {
              programAddress: instructionConfig?.programAddress ?? config.programAddress
            })
          ),
          routeTokenCreatorRevenue: (input, instructionConfig) => addSelfPlanAndSendFunctions(
            client,
            getRouteTokenCreatorRevenueInstruction(input, {
              programAddress: instructionConfig?.programAddress ?? config.programAddress
            })
          ),
          setListingApproved: (input, instructionConfig) => addSelfPlanAndSendFunctions(
            client,
            getSetListingApprovedInstruction(input, {
              programAddress: instructionConfig?.programAddress ?? config.programAddress
            })
          ),
          setPaused: (input, instructionConfig) => addSelfPlanAndSendFunctions(
            client,
            getSetPausedInstruction(input, {
              programAddress: instructionConfig?.programAddress ?? config.programAddress
            })
          ),
          withdraw: (input, instructionConfig) => addSelfPlanAndSendFunctions(
            client,
            getWithdrawInstructionAsync(input, {
              programAddress: instructionConfig?.programAddress ?? config.programAddress
            })
          )
        },
        pdas: {
          listing: (seeds, pdaConfig) => findListingPda(seeds, {
            programAddress: pdaConfig?.programAddress ?? config.programAddress
          }),
          baseVault: (seeds, pdaConfig) => findBaseVaultPda(seeds, {
            programAddress: pdaConfig?.programAddress ?? config.programAddress
          }),
          campaign: (seeds, pdaConfig) => findCampaignPda(seeds, {
            programAddress: pdaConfig?.programAddress ?? config.programAddress
          }),
          claim: (seeds, pdaConfig) => findClaimPda(seeds, {
            programAddress: pdaConfig?.programAddress ?? config.programAddress
          }),
          airdropVault: (seeds, pdaConfig) => findAirdropVaultPda(seeds, {
            programAddress: pdaConfig?.programAddress ?? config.programAddress
          }),
          margin: (seeds, pdaConfig) => findMarginPda(seeds, {
            programAddress: pdaConfig?.programAddress ?? config.programAddress
          }),
          quoteVault: (seeds, pdaConfig) => findQuoteVaultPda(seeds, {
            programAddress: pdaConfig?.programAddress ?? config.programAddress
          }),
          protocol: (seeds, pdaConfig) => findProtocolPda(seeds, {
            programAddress: pdaConfig?.programAddress ?? config.programAddress
          })
        },
        identifyAccount: identifyLevermemeAccount,
        identifyInstruction: identifyLevermemeInstruction,
        parseInstruction: parseLevermemeInstruction
      }
    });
  };
}

// clients/generated/errors/levermeme.ts
var LEVERMEME_ERROR__PAUSED = 6e3;
var LEVERMEME_ERROR__INVALID_AMOUNT = 6001;
var LEVERMEME_ERROR__OVERFLOW = 6002;
var LEVERMEME_ERROR__UNSAFE_MINT = 6003;
var LEVERMEME_ERROR__UNSAFE_EXTENSION = 6004;
var LEVERMEME_ERROR__SAME_MINT = 6005;
var LEVERMEME_ERROR__NOT_PUMP = 6006;
var LEVERMEME_ERROR__TRANSFER_DELTA = 6007;
var LEVERMEME_ERROR__ALREADY_CANCELLED = 6008;
var LEVERMEME_ERROR__INSUFFICIENT_FUNDS = 6009;
var LEVERMEME_ERROR__INVALID_POLICY = 6010;
var LEVERMEME_ERROR__NOT_APPROVED = 6011;
var LEVERMEME_ERROR__INVALID_CAMPAIGN = 6012;
var LEVERMEME_ERROR__CAMPAIGN_CLOSED = 6013;
var LEVERMEME_ERROR__INVALID_PROOF = 6014;
var levermemeErrorMessages;
if (process.env["NODE_ENV"] !== "production") {
  levermemeErrorMessages = {
    [LEVERMEME_ERROR__ALREADY_CANCELLED]: `Listing was already cancelled`,
    [LEVERMEME_ERROR__CAMPAIGN_CLOSED]: `Airdrop has not started, has expired, or was reclaimed`,
    [LEVERMEME_ERROR__INSUFFICIENT_FUNDS]: `Insufficient available balance`,
    [LEVERMEME_ERROR__INVALID_AMOUNT]: `The amount is zero or below the configured minimum`,
    [LEVERMEME_ERROR__INVALID_CAMPAIGN]: `Invalid campaign timing, root or proof length`,
    [LEVERMEME_ERROR__INVALID_POLICY]: `Invalid listing or fee policy`,
    [LEVERMEME_ERROR__INVALID_PROOF]: `Airdrop proof does not match this campaign, wallet, index and amount`,
    [LEVERMEME_ERROR__NOT_APPROVED]: `Market listing has not been approved, or was cancelled`,
    [LEVERMEME_ERROR__NOT_PUMP]: `The coin is not a verified pump.fun mint`,
    [LEVERMEME_ERROR__OVERFLOW]: `Arithmetic overflow`,
    [LEVERMEME_ERROR__PAUSED]: `New listings and deposits are paused`,
    [LEVERMEME_ERROR__SAME_MINT]: `Base, quote and burn mints must be distinct`,
    [LEVERMEME_ERROR__TRANSFER_DELTA]: `Token transfer amount does not match the received balance`,
    [LEVERMEME_ERROR__UNSAFE_EXTENSION]: `Token-2022 extension is not supported for custody`,
    [LEVERMEME_ERROR__UNSAFE_MINT]: `Token mint is uninitialized, mintable or freezable`
  };
}
function getLevermemeErrorMessage(code) {
  if (process.env["NODE_ENV"] !== "production") {
    return levermemeErrorMessages[code];
  }
  return "Error message not available in production bundles.";
}
function isLevermemeError(error, transactionMessage, code, config = {}) {
  const programAddressInput = config.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  return isProgramError(
    error,
    transactionMessage,
    programAddress,
    code
  );
}

// clients/generated/events/airdropClaimed.ts
import {
  combineCodec as combineCodec20,
  containsBytes as containsBytes2,
  fixEncoderSize as fixEncoderSize20,
  getAddressDecoder as getAddressDecoder7,
  getAddressEncoder as getAddressEncoder16,
  getBytesEncoder as getBytesEncoder28,
  getConstantDecoder,
  getConstantEncoder,
  getHiddenPrefixDecoder,
  getHiddenPrefixEncoder,
  getStructDecoder as getStructDecoder20,
  getStructEncoder as getStructEncoder20,
  getU64Decoder as getU64Decoder13,
  getU64Encoder as getU64Encoder13
} from "@solana/kit";
var AIRDROP_CLAIMED_EVENT_DISCRIMINATOR = new Uint8Array([125, 251, 195, 183, 202, 126, 89, 68]);
function getAirdropClaimedEventDiscriminatorBytes() {
  return fixEncoderSize20(getBytesEncoder28(), 8).encode(
    AIRDROP_CLAIMED_EVENT_DISCRIMINATOR
  );
}
function getAirdropClaimedEventEncoder() {
  return getHiddenPrefixEncoder(
    getStructEncoder20([
      ["campaign", getAddressEncoder16()],
      ["owner", getAddressEncoder16()],
      ["amount", getU64Encoder13()]
    ]),
    [getConstantEncoder(AIRDROP_CLAIMED_EVENT_DISCRIMINATOR)]
  );
}
function getAirdropClaimedEventDecoder() {
  return getHiddenPrefixDecoder(
    getStructDecoder20([
      ["campaign", getAddressDecoder7()],
      ["owner", getAddressDecoder7()],
      ["amount", getU64Decoder13()]
    ]),
    [getConstantDecoder(AIRDROP_CLAIMED_EVENT_DISCRIMINATOR)]
  );
}
function getAirdropClaimedEventCodec() {
  return combineCodec20(
    getAirdropClaimedEventEncoder(),
    getAirdropClaimedEventDecoder()
  );
}
function parseAirdropClaimedEvent(data) {
  if (containsBytes2(data, AIRDROP_CLAIMED_EVENT_DISCRIMINATOR, 0)) {
    return getAirdropClaimedEventDecoder().decode(data);
  }
  throw new Error(
    'The provided data does not match the "AirdropClaimedEvent" event discriminators.'
  );
}

// clients/generated/events/airdropCreated.ts
import {
  combineCodec as combineCodec21,
  containsBytes as containsBytes3,
  fixEncoderSize as fixEncoderSize21,
  getAddressDecoder as getAddressDecoder8,
  getAddressEncoder as getAddressEncoder17,
  getBytesEncoder as getBytesEncoder29,
  getConstantDecoder as getConstantDecoder2,
  getConstantEncoder as getConstantEncoder2,
  getHiddenPrefixDecoder as getHiddenPrefixDecoder2,
  getHiddenPrefixEncoder as getHiddenPrefixEncoder2,
  getI64Decoder as getI64Decoder4,
  getI64Encoder as getI64Encoder4,
  getStructDecoder as getStructDecoder21,
  getStructEncoder as getStructEncoder21,
  getU64Decoder as getU64Decoder14,
  getU64Encoder as getU64Encoder14
} from "@solana/kit";
var AIRDROP_CREATED_EVENT_DISCRIMINATOR = new Uint8Array([190, 219, 101, 33, 208, 187, 149, 96]);
function getAirdropCreatedEventDiscriminatorBytes() {
  return fixEncoderSize21(getBytesEncoder29(), 8).encode(
    AIRDROP_CREATED_EVENT_DISCRIMINATOR
  );
}
function getAirdropCreatedEventEncoder() {
  return getHiddenPrefixEncoder2(
    getStructEncoder21([
      ["campaign", getAddressEncoder17()],
      ["total", getU64Encoder14()],
      ["startsAt", getI64Encoder4()],
      ["endsAt", getI64Encoder4()]
    ]),
    [getConstantEncoder2(AIRDROP_CREATED_EVENT_DISCRIMINATOR)]
  );
}
function getAirdropCreatedEventDecoder() {
  return getHiddenPrefixDecoder2(
    getStructDecoder21([
      ["campaign", getAddressDecoder8()],
      ["total", getU64Decoder14()],
      ["startsAt", getI64Decoder4()],
      ["endsAt", getI64Decoder4()]
    ]),
    [getConstantDecoder2(AIRDROP_CREATED_EVENT_DISCRIMINATOR)]
  );
}
function getAirdropCreatedEventCodec() {
  return combineCodec21(
    getAirdropCreatedEventEncoder(),
    getAirdropCreatedEventDecoder()
  );
}
function parseAirdropCreatedEvent(data) {
  if (containsBytes3(data, AIRDROP_CREATED_EVENT_DISCRIMINATOR, 0)) {
    return getAirdropCreatedEventDecoder().decode(data);
  }
  throw new Error(
    'The provided data does not match the "AirdropCreatedEvent" event discriminators.'
  );
}

// clients/generated/events/collateralChanged.ts
import {
  combineCodec as combineCodec22,
  containsBytes as containsBytes4,
  fixEncoderSize as fixEncoderSize22,
  getAddressDecoder as getAddressDecoder9,
  getAddressEncoder as getAddressEncoder18,
  getBooleanDecoder as getBooleanDecoder6,
  getBooleanEncoder as getBooleanEncoder6,
  getBytesEncoder as getBytesEncoder30,
  getConstantDecoder as getConstantDecoder3,
  getConstantEncoder as getConstantEncoder3,
  getHiddenPrefixDecoder as getHiddenPrefixDecoder3,
  getHiddenPrefixEncoder as getHiddenPrefixEncoder3,
  getStructDecoder as getStructDecoder22,
  getStructEncoder as getStructEncoder22,
  getU64Decoder as getU64Decoder15,
  getU64Encoder as getU64Encoder15
} from "@solana/kit";
var COLLATERAL_CHANGED_EVENT_DISCRIMINATOR = new Uint8Array([172, 114, 48, 57, 98, 83, 95, 157]);
function getCollateralChangedEventDiscriminatorBytes() {
  return fixEncoderSize22(getBytesEncoder30(), 8).encode(
    COLLATERAL_CHANGED_EVENT_DISCRIMINATOR
  );
}
function getCollateralChangedEventEncoder() {
  return getHiddenPrefixEncoder3(
    getStructEncoder22([
      ["margin", getAddressEncoder18()],
      ["owner", getAddressEncoder18()],
      ["amount", getU64Encoder15()],
      ["deposit", getBooleanEncoder6()],
      ["balance", getU64Encoder15()]
    ]),
    [getConstantEncoder3(COLLATERAL_CHANGED_EVENT_DISCRIMINATOR)]
  );
}
function getCollateralChangedEventDecoder() {
  return getHiddenPrefixDecoder3(
    getStructDecoder22([
      ["margin", getAddressDecoder9()],
      ["owner", getAddressDecoder9()],
      ["amount", getU64Decoder15()],
      ["deposit", getBooleanDecoder6()],
      ["balance", getU64Decoder15()]
    ]),
    [getConstantDecoder3(COLLATERAL_CHANGED_EVENT_DISCRIMINATOR)]
  );
}
function getCollateralChangedEventCodec() {
  return combineCodec22(
    getCollateralChangedEventEncoder(),
    getCollateralChangedEventDecoder()
  );
}
function parseCollateralChangedEvent(data) {
  if (containsBytes4(data, COLLATERAL_CHANGED_EVENT_DISCRIMINATOR, 0)) {
    return getCollateralChangedEventDecoder().decode(data);
  }
  throw new Error(
    'The provided data does not match the "CollateralChangedEvent" event discriminators.'
  );
}

// clients/generated/events/listingCancelled.ts
import {
  combineCodec as combineCodec23,
  containsBytes as containsBytes5,
  fixEncoderSize as fixEncoderSize23,
  getAddressDecoder as getAddressDecoder10,
  getAddressEncoder as getAddressEncoder19,
  getBytesEncoder as getBytesEncoder31,
  getConstantDecoder as getConstantDecoder4,
  getConstantEncoder as getConstantEncoder4,
  getHiddenPrefixDecoder as getHiddenPrefixDecoder4,
  getHiddenPrefixEncoder as getHiddenPrefixEncoder4,
  getStructDecoder as getStructDecoder23,
  getStructEncoder as getStructEncoder23
} from "@solana/kit";
var LISTING_CANCELLED_EVENT_DISCRIMINATOR = new Uint8Array([11, 46, 163, 10, 103, 80, 139, 194]);
function getListingCancelledEventDiscriminatorBytes() {
  return fixEncoderSize23(getBytesEncoder31(), 8).encode(
    LISTING_CANCELLED_EVENT_DISCRIMINATOR
  );
}
function getListingCancelledEventEncoder() {
  return getHiddenPrefixEncoder4(
    getStructEncoder23([
      ["listing", getAddressEncoder19()],
      ["lister", getAddressEncoder19()]
    ]),
    [getConstantEncoder4(LISTING_CANCELLED_EVENT_DISCRIMINATOR)]
  );
}
function getListingCancelledEventDecoder() {
  return getHiddenPrefixDecoder4(
    getStructDecoder23([
      ["listing", getAddressDecoder10()],
      ["lister", getAddressDecoder10()]
    ]),
    [getConstantDecoder4(LISTING_CANCELLED_EVENT_DISCRIMINATOR)]
  );
}
function getListingCancelledEventCodec() {
  return combineCodec23(
    getListingCancelledEventEncoder(),
    getListingCancelledEventDecoder()
  );
}
function parseListingCancelledEvent(data) {
  if (containsBytes5(data, LISTING_CANCELLED_EVENT_DISCRIMINATOR, 0)) {
    return getListingCancelledEventDecoder().decode(data);
  }
  throw new Error(
    'The provided data does not match the "ListingCancelledEvent" event discriminators.'
  );
}

// clients/generated/events/listingRequested.ts
import {
  combineCodec as combineCodec24,
  containsBytes as containsBytes6,
  fixEncoderSize as fixEncoderSize24,
  getAddressDecoder as getAddressDecoder11,
  getAddressEncoder as getAddressEncoder20,
  getBytesEncoder as getBytesEncoder32,
  getConstantDecoder as getConstantDecoder5,
  getConstantEncoder as getConstantEncoder5,
  getHiddenPrefixDecoder as getHiddenPrefixDecoder5,
  getHiddenPrefixEncoder as getHiddenPrefixEncoder5,
  getStructDecoder as getStructDecoder24,
  getStructEncoder as getStructEncoder24,
  getU64Decoder as getU64Decoder16,
  getU64Encoder as getU64Encoder16
} from "@solana/kit";
var LISTING_REQUESTED_EVENT_DISCRIMINATOR = new Uint8Array([150, 236, 30, 166, 150, 162, 210, 167]);
function getListingRequestedEventDiscriminatorBytes() {
  return fixEncoderSize24(getBytesEncoder32(), 8).encode(
    LISTING_REQUESTED_EVENT_DISCRIMINATOR
  );
}
function getListingRequestedEventEncoder() {
  return getHiddenPrefixEncoder5(
    getStructEncoder24([
      ["listing", getAddressEncoder20()],
      ["lister", getAddressEncoder20()],
      ["baseMint", getAddressEncoder20()],
      ["solLamports", getU64Encoder16()],
      ["tokenAmount", getU64Encoder16()],
      ["burned", getU64Encoder16()]
    ]),
    [getConstantEncoder5(LISTING_REQUESTED_EVENT_DISCRIMINATOR)]
  );
}
function getListingRequestedEventDecoder() {
  return getHiddenPrefixDecoder5(
    getStructDecoder24([
      ["listing", getAddressDecoder11()],
      ["lister", getAddressDecoder11()],
      ["baseMint", getAddressDecoder11()],
      ["solLamports", getU64Decoder16()],
      ["tokenAmount", getU64Decoder16()],
      ["burned", getU64Decoder16()]
    ]),
    [getConstantDecoder5(LISTING_REQUESTED_EVENT_DISCRIMINATOR)]
  );
}
function getListingRequestedEventCodec() {
  return combineCodec24(
    getListingRequestedEventEncoder(),
    getListingRequestedEventDecoder()
  );
}
function parseListingRequestedEvent(data) {
  if (containsBytes6(data, LISTING_REQUESTED_EVENT_DISCRIMINATOR, 0)) {
    return getListingRequestedEventDecoder().decode(data);
  }
  throw new Error(
    'The provided data does not match the "ListingRequestedEvent" event discriminators.'
  );
}

// clients/generated/events/listingReviewed.ts
import {
  combineCodec as combineCodec25,
  containsBytes as containsBytes7,
  fixEncoderSize as fixEncoderSize25,
  getAddressDecoder as getAddressDecoder12,
  getAddressEncoder as getAddressEncoder21,
  getBooleanDecoder as getBooleanDecoder7,
  getBooleanEncoder as getBooleanEncoder7,
  getBytesEncoder as getBytesEncoder33,
  getConstantDecoder as getConstantDecoder6,
  getConstantEncoder as getConstantEncoder6,
  getHiddenPrefixDecoder as getHiddenPrefixDecoder6,
  getHiddenPrefixEncoder as getHiddenPrefixEncoder6,
  getStructDecoder as getStructDecoder25,
  getStructEncoder as getStructEncoder25
} from "@solana/kit";
var LISTING_REVIEWED_EVENT_DISCRIMINATOR = new Uint8Array([33, 226, 137, 167, 158, 100, 9, 238]);
function getListingReviewedEventDiscriminatorBytes() {
  return fixEncoderSize25(getBytesEncoder33(), 8).encode(
    LISTING_REVIEWED_EVENT_DISCRIMINATOR
  );
}
function getListingReviewedEventEncoder() {
  return getHiddenPrefixEncoder6(
    getStructEncoder25([
      ["listing", getAddressEncoder21()],
      ["approved", getBooleanEncoder7()]
    ]),
    [getConstantEncoder6(LISTING_REVIEWED_EVENT_DISCRIMINATOR)]
  );
}
function getListingReviewedEventDecoder() {
  return getHiddenPrefixDecoder6(
    getStructDecoder25([
      ["listing", getAddressDecoder12()],
      ["approved", getBooleanDecoder7()]
    ]),
    [getConstantDecoder6(LISTING_REVIEWED_EVENT_DISCRIMINATOR)]
  );
}
function getListingReviewedEventCodec() {
  return combineCodec25(
    getListingReviewedEventEncoder(),
    getListingReviewedEventDecoder()
  );
}
function parseListingReviewedEvent(data) {
  if (containsBytes7(data, LISTING_REVIEWED_EVENT_DISCRIMINATOR, 0)) {
    return getListingReviewedEventDecoder().decode(data);
  }
  throw new Error(
    'The provided data does not match the "ListingReviewedEvent" event discriminators.'
  );
}

// clients/generated/events/pauseChanged.ts
import {
  combineCodec as combineCodec26,
  containsBytes as containsBytes8,
  fixEncoderSize as fixEncoderSize26,
  getAddressDecoder as getAddressDecoder13,
  getAddressEncoder as getAddressEncoder22,
  getBooleanDecoder as getBooleanDecoder8,
  getBooleanEncoder as getBooleanEncoder8,
  getBytesEncoder as getBytesEncoder34,
  getConstantDecoder as getConstantDecoder7,
  getConstantEncoder as getConstantEncoder7,
  getHiddenPrefixDecoder as getHiddenPrefixDecoder7,
  getHiddenPrefixEncoder as getHiddenPrefixEncoder7,
  getStructDecoder as getStructDecoder26,
  getStructEncoder as getStructEncoder26
} from "@solana/kit";
var PAUSE_CHANGED_EVENT_DISCRIMINATOR = new Uint8Array([238, 188, 213, 78, 134, 209, 178, 218]);
function getPauseChangedEventDiscriminatorBytes() {
  return fixEncoderSize26(getBytesEncoder34(), 8).encode(
    PAUSE_CHANGED_EVENT_DISCRIMINATOR
  );
}
function getPauseChangedEventEncoder() {
  return getHiddenPrefixEncoder7(
    getStructEncoder26([
      ["protocol", getAddressEncoder22()],
      ["paused", getBooleanEncoder8()]
    ]),
    [getConstantEncoder7(PAUSE_CHANGED_EVENT_DISCRIMINATOR)]
  );
}
function getPauseChangedEventDecoder() {
  return getHiddenPrefixDecoder7(
    getStructDecoder26([
      ["protocol", getAddressDecoder13()],
      ["paused", getBooleanDecoder8()]
    ]),
    [getConstantDecoder7(PAUSE_CHANGED_EVENT_DISCRIMINATOR)]
  );
}
function getPauseChangedEventCodec() {
  return combineCodec26(
    getPauseChangedEventEncoder(),
    getPauseChangedEventDecoder()
  );
}
function parsePauseChangedEvent(data) {
  if (containsBytes8(data, PAUSE_CHANGED_EVENT_DISCRIMINATOR, 0)) {
    return getPauseChangedEventDecoder().decode(data);
  }
  throw new Error(
    'The provided data does not match the "PauseChangedEvent" event discriminators.'
  );
}

// clients/generated/events/protocolCreated.ts
import {
  combineCodec as combineCodec27,
  containsBytes as containsBytes9,
  fixEncoderSize as fixEncoderSize27,
  getAddressDecoder as getAddressDecoder14,
  getAddressEncoder as getAddressEncoder23,
  getBytesEncoder as getBytesEncoder35,
  getConstantDecoder as getConstantDecoder8,
  getConstantEncoder as getConstantEncoder8,
  getHiddenPrefixDecoder as getHiddenPrefixDecoder8,
  getHiddenPrefixEncoder as getHiddenPrefixEncoder8,
  getStructDecoder as getStructDecoder27,
  getStructEncoder as getStructEncoder27
} from "@solana/kit";
var PROTOCOL_CREATED_EVENT_DISCRIMINATOR = new Uint8Array([15, 251, 247, 158, 97, 201, 1, 226]);
function getProtocolCreatedEventDiscriminatorBytes() {
  return fixEncoderSize27(getBytesEncoder35(), 8).encode(
    PROTOCOL_CREATED_EVENT_DISCRIMINATOR
  );
}
function getProtocolCreatedEventEncoder() {
  return getHiddenPrefixEncoder8(
    getStructEncoder27([
      ["protocol", getAddressEncoder23()],
      ["admin", getAddressEncoder23()]
    ]),
    [getConstantEncoder8(PROTOCOL_CREATED_EVENT_DISCRIMINATOR)]
  );
}
function getProtocolCreatedEventDecoder() {
  return getHiddenPrefixDecoder8(
    getStructDecoder27([
      ["protocol", getAddressDecoder14()],
      ["admin", getAddressDecoder14()]
    ]),
    [getConstantDecoder8(PROTOCOL_CREATED_EVENT_DISCRIMINATOR)]
  );
}
function getProtocolCreatedEventCodec() {
  return combineCodec27(
    getProtocolCreatedEventEncoder(),
    getProtocolCreatedEventDecoder()
  );
}
function parseProtocolCreatedEvent(data) {
  if (containsBytes9(data, PROTOCOL_CREATED_EVENT_DISCRIMINATOR, 0)) {
    return getProtocolCreatedEventDecoder().decode(data);
  }
  throw new Error(
    'The provided data does not match the "ProtocolCreatedEvent" event discriminators.'
  );
}

// clients/generated/events/revenueRouted.ts
import {
  combineCodec as combineCodec28,
  containsBytes as containsBytes10,
  fixEncoderSize as fixEncoderSize28,
  getAddressDecoder as getAddressDecoder15,
  getAddressEncoder as getAddressEncoder24,
  getArrayDecoder as getArrayDecoder3,
  getArrayEncoder as getArrayEncoder3,
  getBytesEncoder as getBytesEncoder36,
  getConstantDecoder as getConstantDecoder9,
  getConstantEncoder as getConstantEncoder9,
  getHiddenPrefixDecoder as getHiddenPrefixDecoder9,
  getHiddenPrefixEncoder as getHiddenPrefixEncoder9,
  getStructDecoder as getStructDecoder28,
  getStructEncoder as getStructEncoder28,
  getU64Decoder as getU64Decoder17,
  getU64Encoder as getU64Encoder17,
  getU8Decoder as getU8Decoder5,
  getU8Encoder as getU8Encoder5
} from "@solana/kit";
var REVENUE_ROUTED_EVENT_DISCRIMINATOR = new Uint8Array([57, 95, 242, 242, 222, 199, 192, 120]);
function getRevenueRoutedEventDiscriminatorBytes() {
  return fixEncoderSize28(getBytesEncoder36(), 8).encode(
    REVENUE_ROUTED_EVENT_DISCRIMINATOR
  );
}
function getRevenueRoutedEventEncoder() {
  return getHiddenPrefixEncoder9(
    getStructEncoder28([
      ["protocol", getAddressEncoder24()],
      ["amount", getU64Encoder17()],
      ["kind", getU8Encoder5()],
      ["parts", getArrayEncoder3(getU64Encoder17(), { size: 4 })]
    ]),
    [getConstantEncoder9(REVENUE_ROUTED_EVENT_DISCRIMINATOR)]
  );
}
function getRevenueRoutedEventDecoder() {
  return getHiddenPrefixDecoder9(
    getStructDecoder28([
      ["protocol", getAddressDecoder15()],
      ["amount", getU64Decoder17()],
      ["kind", getU8Decoder5()],
      ["parts", getArrayDecoder3(getU64Decoder17(), { size: 4 })]
    ]),
    [getConstantDecoder9(REVENUE_ROUTED_EVENT_DISCRIMINATOR)]
  );
}
function getRevenueRoutedEventCodec() {
  return combineCodec28(
    getRevenueRoutedEventEncoder(),
    getRevenueRoutedEventDecoder()
  );
}
function parseRevenueRoutedEvent(data) {
  if (containsBytes10(data, REVENUE_ROUTED_EVENT_DISCRIMINATOR, 0)) {
    return getRevenueRoutedEventDecoder().decode(data);
  }
  throw new Error(
    'The provided data does not match the "RevenueRoutedEvent" event discriminators.'
  );
}
export {
  AIRDROP_CAMPAIGN_DISCRIMINATOR,
  AIRDROP_CLAIMED_EVENT_DISCRIMINATOR,
  AIRDROP_CLAIM_DISCRIMINATOR,
  AIRDROP_CREATED_EVENT_DISCRIMINATOR,
  CANCEL_LISTING_DISCRIMINATOR,
  CLAIM_AIRDROP_DISCRIMINATOR,
  COLLATERAL_CHANGED_EVENT_DISCRIMINATOR,
  CREATE_AIRDROP_DISCRIMINATOR,
  DEPOSIT_DISCRIMINATOR,
  INITIALIZE_PROTOCOL_DISCRIMINATOR,
  LEVERMEME_ERROR__ALREADY_CANCELLED,
  LEVERMEME_ERROR__CAMPAIGN_CLOSED,
  LEVERMEME_ERROR__INSUFFICIENT_FUNDS,
  LEVERMEME_ERROR__INVALID_AMOUNT,
  LEVERMEME_ERROR__INVALID_CAMPAIGN,
  LEVERMEME_ERROR__INVALID_POLICY,
  LEVERMEME_ERROR__INVALID_PROOF,
  LEVERMEME_ERROR__NOT_APPROVED,
  LEVERMEME_ERROR__NOT_PUMP,
  LEVERMEME_ERROR__OVERFLOW,
  LEVERMEME_ERROR__PAUSED,
  LEVERMEME_ERROR__SAME_MINT,
  LEVERMEME_ERROR__TRANSFER_DELTA,
  LEVERMEME_ERROR__UNSAFE_EXTENSION,
  LEVERMEME_ERROR__UNSAFE_MINT,
  LEVERMEME_PROGRAM_ADDRESS,
  LISTING_CANCELLED_EVENT_DISCRIMINATOR,
  LISTING_DISCRIMINATOR,
  LISTING_REQUESTED_EVENT_DISCRIMINATOR,
  LISTING_REVIEWED_EVENT_DISCRIMINATOR,
  LevermemeAccount,
  LevermemeEvent,
  LevermemeInstruction,
  MARGIN_ACCOUNT_DISCRIMINATOR,
  OPEN_MARGIN_ACCOUNT_DISCRIMINATOR,
  PAUSE_CHANGED_EVENT_DISCRIMINATOR,
  PROTOCOL_CREATED_EVENT_DISCRIMINATOR,
  PROTOCOL_DISCRIMINATOR,
  RECLAIM_AIRDROP_DISCRIMINATOR,
  REQUEST_LISTING_DISCRIMINATOR,
  REVENUE_ROUTED_EVENT_DISCRIMINATOR,
  ROUTE_PLATFORM_REVENUE_DISCRIMINATOR,
  ROUTE_TOKEN_CREATOR_REVENUE_DISCRIMINATOR,
  SET_LISTING_APPROVED_DISCRIMINATOR,
  SET_PAUSED_DISCRIMINATOR,
  WITHDRAW_DISCRIMINATOR,
  decodeAirdropCampaign,
  decodeAirdropClaim,
  decodeListing,
  decodeMarginAccount,
  decodeProtocol,
  fetchAirdropCampaign,
  fetchAirdropClaim,
  fetchAllAirdropCampaign,
  fetchAllAirdropClaim,
  fetchAllListing,
  fetchAllMarginAccount,
  fetchAllMaybeAirdropCampaign,
  fetchAllMaybeAirdropClaim,
  fetchAllMaybeListing,
  fetchAllMaybeMarginAccount,
  fetchAllMaybeProtocol,
  fetchAllProtocol,
  fetchListing,
  fetchMarginAccount,
  fetchMaybeAirdropCampaign,
  fetchMaybeAirdropClaim,
  fetchMaybeListing,
  fetchMaybeMarginAccount,
  fetchMaybeProtocol,
  fetchProtocol,
  findAirdropVaultPda,
  findBaseVaultPda,
  findCampaignPda,
  findClaimPda,
  findListingPda,
  findMarginPda,
  findProtocolPda,
  findQuoteVaultPda,
  getAirdropCampaignCodec,
  getAirdropCampaignDecoder,
  getAirdropCampaignDiscriminatorBytes,
  getAirdropCampaignEncoder,
  getAirdropCampaignSize,
  getAirdropClaimCodec,
  getAirdropClaimDecoder,
  getAirdropClaimDiscriminatorBytes,
  getAirdropClaimEncoder,
  getAirdropClaimSize,
  getAirdropClaimedEventCodec,
  getAirdropClaimedEventDecoder,
  getAirdropClaimedEventDiscriminatorBytes,
  getAirdropClaimedEventEncoder,
  getAirdropCreatedEventCodec,
  getAirdropCreatedEventDecoder,
  getAirdropCreatedEventDiscriminatorBytes,
  getAirdropCreatedEventEncoder,
  getCancelListingDiscriminatorBytes,
  getCancelListingInstruction,
  getCancelListingInstructionAsync,
  getCancelListingInstructionDataCodec,
  getCancelListingInstructionDataDecoder,
  getCancelListingInstructionDataEncoder,
  getClaimAirdropDiscriminatorBytes,
  getClaimAirdropInstruction,
  getClaimAirdropInstructionAsync,
  getClaimAirdropInstructionDataCodec,
  getClaimAirdropInstructionDataDecoder,
  getClaimAirdropInstructionDataEncoder,
  getCollateralChangedEventCodec,
  getCollateralChangedEventDecoder,
  getCollateralChangedEventDiscriminatorBytes,
  getCollateralChangedEventEncoder,
  getCreateAirdropDiscriminatorBytes,
  getCreateAirdropInstruction,
  getCreateAirdropInstructionAsync,
  getCreateAirdropInstructionDataCodec,
  getCreateAirdropInstructionDataDecoder,
  getCreateAirdropInstructionDataEncoder,
  getDepositDiscriminatorBytes,
  getDepositInstruction,
  getDepositInstructionAsync,
  getDepositInstructionDataCodec,
  getDepositInstructionDataDecoder,
  getDepositInstructionDataEncoder,
  getInitializeProtocolDiscriminatorBytes,
  getInitializeProtocolInstruction,
  getInitializeProtocolInstructionAsync,
  getInitializeProtocolInstructionDataCodec,
  getInitializeProtocolInstructionDataDecoder,
  getInitializeProtocolInstructionDataEncoder,
  getLevermemeErrorMessage,
  getListingCancelledEventCodec,
  getListingCancelledEventDecoder,
  getListingCancelledEventDiscriminatorBytes,
  getListingCancelledEventEncoder,
  getListingCodec,
  getListingDecoder,
  getListingDiscriminatorBytes,
  getListingEncoder,
  getListingPolicyCodec,
  getListingPolicyDecoder,
  getListingPolicyEncoder,
  getListingRequestedEventCodec,
  getListingRequestedEventDecoder,
  getListingRequestedEventDiscriminatorBytes,
  getListingRequestedEventEncoder,
  getListingReviewedEventCodec,
  getListingReviewedEventDecoder,
  getListingReviewedEventDiscriminatorBytes,
  getListingReviewedEventEncoder,
  getListingSize,
  getMarginAccountCodec,
  getMarginAccountDecoder,
  getMarginAccountDiscriminatorBytes,
  getMarginAccountEncoder,
  getMarginAccountSize,
  getOpenMarginAccountDiscriminatorBytes,
  getOpenMarginAccountInstruction,
  getOpenMarginAccountInstructionAsync,
  getOpenMarginAccountInstructionDataCodec,
  getOpenMarginAccountInstructionDataDecoder,
  getOpenMarginAccountInstructionDataEncoder,
  getPauseChangedEventCodec,
  getPauseChangedEventDecoder,
  getPauseChangedEventDiscriminatorBytes,
  getPauseChangedEventEncoder,
  getProtocolCodec,
  getProtocolCreatedEventCodec,
  getProtocolCreatedEventDecoder,
  getProtocolCreatedEventDiscriminatorBytes,
  getProtocolCreatedEventEncoder,
  getProtocolDecoder,
  getProtocolDiscriminatorBytes,
  getProtocolEncoder,
  getProtocolSize,
  getReclaimAirdropDiscriminatorBytes,
  getReclaimAirdropInstruction,
  getReclaimAirdropInstructionAsync,
  getReclaimAirdropInstructionDataCodec,
  getReclaimAirdropInstructionDataDecoder,
  getReclaimAirdropInstructionDataEncoder,
  getRequestListingDiscriminatorBytes,
  getRequestListingInstruction,
  getRequestListingInstructionAsync,
  getRequestListingInstructionDataCodec,
  getRequestListingInstructionDataDecoder,
  getRequestListingInstructionDataEncoder,
  getRevenueRoutedEventCodec,
  getRevenueRoutedEventDecoder,
  getRevenueRoutedEventDiscriminatorBytes,
  getRevenueRoutedEventEncoder,
  getRoutePlatformRevenueDiscriminatorBytes,
  getRoutePlatformRevenueInstruction,
  getRoutePlatformRevenueInstructionDataCodec,
  getRoutePlatformRevenueInstructionDataDecoder,
  getRoutePlatformRevenueInstructionDataEncoder,
  getRouteTokenCreatorRevenueDiscriminatorBytes,
  getRouteTokenCreatorRevenueInstruction,
  getRouteTokenCreatorRevenueInstructionDataCodec,
  getRouteTokenCreatorRevenueInstructionDataDecoder,
  getRouteTokenCreatorRevenueInstructionDataEncoder,
  getSetListingApprovedDiscriminatorBytes,
  getSetListingApprovedInstruction,
  getSetListingApprovedInstructionDataCodec,
  getSetListingApprovedInstructionDataDecoder,
  getSetListingApprovedInstructionDataEncoder,
  getSetPausedDiscriminatorBytes,
  getSetPausedInstruction,
  getSetPausedInstructionDataCodec,
  getSetPausedInstructionDataDecoder,
  getSetPausedInstructionDataEncoder,
  getWithdrawDiscriminatorBytes,
  getWithdrawInstruction,
  getWithdrawInstructionAsync,
  getWithdrawInstructionDataCodec,
  getWithdrawInstructionDataDecoder,
  getWithdrawInstructionDataEncoder,
  identifyLevermemeAccount,
  identifyLevermemeEvent,
  identifyLevermemeInstruction,
  isLevermemeError,
  levermemeProgram,
  parseAirdropClaimedEvent,
  parseAirdropCreatedEvent,
  parseCancelListingInstruction,
  parseClaimAirdropInstruction,
  parseCollateralChangedEvent,
  parseCreateAirdropInstruction,
  parseDepositInstruction,
  parseInitializeProtocolInstruction,
  parseLevermemeInstruction,
  parseListingCancelledEvent,
  parseListingRequestedEvent,
  parseListingReviewedEvent,
  parseOpenMarginAccountInstruction,
  parsePauseChangedEvent,
  parseProtocolCreatedEvent,
  parseReclaimAirdropInstruction,
  parseRequestListingInstruction,
  parseRevenueRoutedEvent,
  parseRoutePlatformRevenueInstruction,
  parseRouteTokenCreatorRevenueInstruction,
  parseSetListingApprovedInstruction,
  parseSetPausedInstruction,
  parseWithdrawInstruction
};
