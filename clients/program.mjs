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
      ["marketInitialized", getBooleanEncoder2()],
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
    ["marketInitialized", getBooleanDecoder2()],
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
  return 172;
}

// clients/generated/accounts/listingPermit.ts
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
  getBooleanDecoder as getBooleanDecoder3,
  getBooleanEncoder as getBooleanEncoder3,
  getBytesDecoder as getBytesDecoder4,
  getBytesEncoder as getBytesEncoder4,
  getI64Decoder as getI64Decoder3,
  getI64Encoder as getI64Encoder3,
  getStructDecoder as getStructDecoder4,
  getStructEncoder as getStructEncoder4,
  getU8Decoder as getU8Decoder3,
  getU8Encoder as getU8Encoder3,
  transformEncoder as transformEncoder4
} from "@solana/kit";
var LISTING_PERMIT_DISCRIMINATOR = new Uint8Array([
  117,
  63,
  230,
  146,
  238,
  62,
  186,
  162
]);
function getListingPermitDiscriminatorBytes() {
  return fixEncoderSize4(getBytesEncoder4(), 8).encode(
    LISTING_PERMIT_DISCRIMINATOR
  );
}
function getListingPermitEncoder() {
  return transformEncoder4(
    getStructEncoder4([
      ["discriminator", fixEncoderSize4(getBytesEncoder4(), 8)],
      ["protocol", getAddressEncoder4()],
      ["baseMint", getAddressEncoder4()],
      ["lister", getAddressEncoder4()],
      ["expiresAt", getI64Encoder3()],
      ["consumed", getBooleanEncoder3()],
      ["bump", getU8Encoder3()]
    ]),
    (value) => ({ ...value, discriminator: LISTING_PERMIT_DISCRIMINATOR })
  );
}
function getListingPermitDecoder() {
  return getStructDecoder4([
    ["discriminator", fixDecoderSize4(getBytesDecoder4(), 8)],
    ["protocol", getAddressDecoder4()],
    ["baseMint", getAddressDecoder4()],
    ["lister", getAddressDecoder4()],
    ["expiresAt", getI64Decoder3()],
    ["consumed", getBooleanDecoder3()],
    ["bump", getU8Decoder3()]
  ]);
}
function getListingPermitCodec() {
  return combineCodec4(getListingPermitEncoder(), getListingPermitDecoder());
}
function decodeListingPermit(encodedAccount) {
  return decodeAccount4(
    encodedAccount,
    getListingPermitDecoder()
  );
}
async function fetchListingPermit(rpc, address, config) {
  const maybeAccount = await fetchMaybeListingPermit(rpc, address, config);
  assertAccountExists4(maybeAccount);
  return maybeAccount;
}
async function fetchMaybeListingPermit(rpc, address, config) {
  const maybeAccount = await fetchEncodedAccount4(
    "rpc" in rpc ? rpc.rpc : rpc,
    typeof address === "string" ? address : address.address,
    config
  );
  return decodeListingPermit(maybeAccount);
}
async function fetchAllListingPermit(rpc, addresses, config) {
  const maybeAccounts = await fetchAllMaybeListingPermit(
    rpc,
    addresses,
    config
  );
  assertAccountsExist4(maybeAccounts);
  return maybeAccounts;
}
async function fetchAllMaybeListingPermit(rpc, addresses, config) {
  const maybeAccounts = await fetchEncodedAccounts4(
    "rpc" in rpc ? rpc.rpc : rpc,
    addresses.map((a) => typeof a === "string" ? a : a.address),
    config
  );
  return maybeAccounts.map((maybeAccount) => decodeListingPermit(maybeAccount));
}
function getListingPermitSize() {
  return 114;
}

// clients/generated/accounts/marginAccount.ts
import {
  assertAccountExists as assertAccountExists5,
  assertAccountsExist as assertAccountsExist5,
  combineCodec as combineCodec5,
  decodeAccount as decodeAccount5,
  fetchEncodedAccount as fetchEncodedAccount5,
  fetchEncodedAccounts as fetchEncodedAccounts5,
  fixDecoderSize as fixDecoderSize5,
  fixEncoderSize as fixEncoderSize5,
  getAddressDecoder as getAddressDecoder5,
  getAddressEncoder as getAddressEncoder5,
  getBytesDecoder as getBytesDecoder5,
  getBytesEncoder as getBytesEncoder5,
  getStructDecoder as getStructDecoder5,
  getStructEncoder as getStructEncoder5,
  getU64Decoder as getU64Decoder4,
  getU64Encoder as getU64Encoder4,
  getU8Decoder as getU8Decoder4,
  getU8Encoder as getU8Encoder4,
  transformEncoder as transformEncoder5
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
  return fixEncoderSize5(getBytesEncoder5(), 8).encode(
    MARGIN_ACCOUNT_DISCRIMINATOR
  );
}
function getMarginAccountEncoder() {
  return transformEncoder5(
    getStructEncoder5([
      ["discriminator", fixEncoderSize5(getBytesEncoder5(), 8)],
      ["protocol", getAddressEncoder5()],
      ["owner", getAddressEncoder5()],
      ["vault", getAddressEncoder5()],
      ["balance", getU64Encoder4()],
      ["locked", getU64Encoder4()],
      ["nextPositionId", getU64Encoder4()],
      ["bump", getU8Encoder4()]
    ]),
    (value) => ({ ...value, discriminator: MARGIN_ACCOUNT_DISCRIMINATOR })
  );
}
function getMarginAccountDecoder() {
  return getStructDecoder5([
    ["discriminator", fixDecoderSize5(getBytesDecoder5(), 8)],
    ["protocol", getAddressDecoder5()],
    ["owner", getAddressDecoder5()],
    ["vault", getAddressDecoder5()],
    ["balance", getU64Decoder4()],
    ["locked", getU64Decoder4()],
    ["nextPositionId", getU64Decoder4()],
    ["bump", getU8Decoder4()]
  ]);
}
function getMarginAccountCodec() {
  return combineCodec5(getMarginAccountEncoder(), getMarginAccountDecoder());
}
function decodeMarginAccount(encodedAccount) {
  return decodeAccount5(
    encodedAccount,
    getMarginAccountDecoder()
  );
}
async function fetchMarginAccount(rpc, address, config) {
  const maybeAccount = await fetchMaybeMarginAccount(rpc, address, config);
  assertAccountExists5(maybeAccount);
  return maybeAccount;
}
async function fetchMaybeMarginAccount(rpc, address, config) {
  const maybeAccount = await fetchEncodedAccount5(
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
  assertAccountsExist5(maybeAccounts);
  return maybeAccounts;
}
async function fetchAllMaybeMarginAccount(rpc, addresses, config) {
  const maybeAccounts = await fetchEncodedAccounts5(
    "rpc" in rpc ? rpc.rpc : rpc,
    addresses.map((a) => typeof a === "string" ? a : a.address),
    config
  );
  return maybeAccounts.map((maybeAccount) => decodeMarginAccount(maybeAccount));
}
function getMarginAccountSize() {
  return 129;
}

// clients/generated/accounts/market.ts
import {
  assertAccountExists as assertAccountExists6,
  assertAccountsExist as assertAccountsExist6,
  combineCodec as combineCodec8,
  decodeAccount as decodeAccount6,
  fetchEncodedAccount as fetchEncodedAccount6,
  fetchEncodedAccounts as fetchEncodedAccounts6,
  fixDecoderSize as fixDecoderSize7,
  fixEncoderSize as fixEncoderSize7,
  getAddressDecoder as getAddressDecoder8,
  getAddressEncoder as getAddressEncoder8,
  getBooleanDecoder as getBooleanDecoder4,
  getBooleanEncoder as getBooleanEncoder4,
  getBytesDecoder as getBytesDecoder7,
  getBytesEncoder as getBytesEncoder7,
  getI64Decoder as getI64Decoder5,
  getI64Encoder as getI64Encoder5,
  getStructDecoder as getStructDecoder8,
  getStructEncoder as getStructEncoder8,
  getU64Decoder as getU64Decoder7,
  getU64Encoder as getU64Encoder7,
  getU8Decoder as getU8Decoder6,
  getU8Encoder as getU8Encoder6,
  transformEncoder as transformEncoder6
} from "@solana/kit";

// clients/generated/types/listingPolicy.ts
import {
  combineCodec as combineCodec6,
  getAddressDecoder as getAddressDecoder6,
  getAddressEncoder as getAddressEncoder6,
  getArrayDecoder,
  getArrayEncoder,
  getStructDecoder as getStructDecoder6,
  getStructEncoder as getStructEncoder6,
  getU16Decoder,
  getU16Encoder,
  getU64Decoder as getU64Decoder5,
  getU64Encoder as getU64Encoder5
} from "@solana/kit";
function getListingPolicyEncoder() {
  return getStructEncoder6([
    ["burnAmount", getU64Encoder5()],
    ["minSolLamports", getU64Encoder5()],
    ["feeBps", getU16Encoder()],
    ["feeShares", getArrayEncoder(getU16Encoder(), { size: 4 })],
    ["feeDestinations", getArrayEncoder(getAddressEncoder6(), { size: 3 })]
  ]);
}
function getListingPolicyDecoder() {
  return getStructDecoder6([
    ["burnAmount", getU64Decoder5()],
    ["minSolLamports", getU64Decoder5()],
    ["feeBps", getU16Decoder()],
    ["feeShares", getArrayDecoder(getU16Decoder(), { size: 4 })],
    ["feeDestinations", getArrayDecoder(getAddressDecoder6(), { size: 3 })]
  ]);
}
function getListingPolicyCodec() {
  return combineCodec6(getListingPolicyEncoder(), getListingPolicyDecoder());
}

// clients/generated/types/marketRisk.ts
import {
  combineCodec as combineCodec7,
  fixDecoderSize as fixDecoderSize6,
  fixEncoderSize as fixEncoderSize6,
  getAddressDecoder as getAddressDecoder7,
  getAddressEncoder as getAddressEncoder7,
  getBytesDecoder as getBytesDecoder6,
  getBytesEncoder as getBytesEncoder6,
  getI64Decoder as getI64Decoder4,
  getI64Encoder as getI64Encoder4,
  getStructDecoder as getStructDecoder7,
  getStructEncoder as getStructEncoder7,
  getU16Decoder as getU16Decoder2,
  getU16Encoder as getU16Encoder2,
  getU32Decoder,
  getU32Encoder,
  getU64Decoder as getU64Decoder6,
  getU64Encoder as getU64Encoder6,
  getU8Decoder as getU8Decoder5,
  getU8Encoder as getU8Encoder5
} from "@solana/kit";
function getMarketRiskEncoder() {
  return getStructEncoder7([
    ["feedHash", fixEncoderSize6(getBytesEncoder6(), 32)],
    ["twapHash", fixEncoderSize6(getBytesEncoder6(), 32)],
    ["queue", getAddressEncoder7()],
    ["maxPriceAgeSlots", getU64Encoder6()],
    ["maxTwapDeviationBps", getU16Encoder2()],
    ["minOracles", getU8Encoder5()],
    ["maxLeverage", getU8Encoder5()],
    ["maintenanceBps", getU16Encoder2()],
    ["liquidationBps", getU16Encoder2()],
    ["spreadBps", getU16Encoder2()],
    ["maxProfitBps", getU32Encoder()],
    ["maxOpenInterest", getU64Encoder6()],
    ["maxPositionNotional", getU64Encoder6()],
    ["minimumMargin", getU64Encoder6()],
    ["minimumLiquidity", getU64Encoder6()],
    ["emergencyDelaySeconds", getI64Encoder4()]
  ]);
}
function getMarketRiskDecoder() {
  return getStructDecoder7([
    ["feedHash", fixDecoderSize6(getBytesDecoder6(), 32)],
    ["twapHash", fixDecoderSize6(getBytesDecoder6(), 32)],
    ["queue", getAddressDecoder7()],
    ["maxPriceAgeSlots", getU64Decoder6()],
    ["maxTwapDeviationBps", getU16Decoder2()],
    ["minOracles", getU8Decoder5()],
    ["maxLeverage", getU8Decoder5()],
    ["maintenanceBps", getU16Decoder2()],
    ["liquidationBps", getU16Decoder2()],
    ["spreadBps", getU16Decoder2()],
    ["maxProfitBps", getU32Decoder()],
    ["maxOpenInterest", getU64Decoder6()],
    ["maxPositionNotional", getU64Decoder6()],
    ["minimumMargin", getU64Decoder6()],
    ["minimumLiquidity", getU64Decoder6()],
    ["emergencyDelaySeconds", getI64Decoder4()]
  ]);
}
function getMarketRiskCodec() {
  return combineCodec7(getMarketRiskEncoder(), getMarketRiskDecoder());
}

// clients/generated/accounts/market.ts
var MARKET_DISCRIMINATOR = new Uint8Array([
  219,
  190,
  213,
  55,
  0,
  227,
  198,
  154
]);
function getMarketDiscriminatorBytes() {
  return fixEncoderSize7(getBytesEncoder7(), 8).encode(MARKET_DISCRIMINATOR);
}
function getMarketEncoder() {
  return transformEncoder6(
    getStructEncoder8([
      ["discriminator", fixEncoderSize7(getBytesEncoder7(), 8)],
      ["protocol", getAddressEncoder8()],
      ["listing", getAddressEncoder8()],
      ["lister", getAddressEncoder8()],
      ["quoteMint", getAddressEncoder8()],
      ["quoteVault", getAddressEncoder8()],
      ["risk", getMarketRiskEncoder()],
      ["enabled", getBooleanEncoder4()],
      ["closed", getBooleanEncoder4()],
      ["bump", getU8Encoder6()],
      ["liquidity", getU64Encoder7()],
      ["reservedProfit", getU64Encoder7()],
      ["totalMargin", getU64Encoder7()],
      ["openInterest", getU64Encoder7()],
      ["accruedFees", getU64Encoder7()],
      ["price", getU64Encoder7()],
      ["twap", getU64Encoder7()],
      ["priceSlot", getU64Encoder7()],
      ["priceTimestamp", getI64Encoder5()]
    ]),
    (value) => ({ ...value, discriminator: MARKET_DISCRIMINATOR })
  );
}
function getMarketDecoder() {
  return getStructDecoder8([
    ["discriminator", fixDecoderSize7(getBytesDecoder7(), 8)],
    ["protocol", getAddressDecoder8()],
    ["listing", getAddressDecoder8()],
    ["lister", getAddressDecoder8()],
    ["quoteMint", getAddressDecoder8()],
    ["quoteVault", getAddressDecoder8()],
    ["risk", getMarketRiskDecoder()],
    ["enabled", getBooleanDecoder4()],
    ["closed", getBooleanDecoder4()],
    ["bump", getU8Decoder6()],
    ["liquidity", getU64Decoder7()],
    ["reservedProfit", getU64Decoder7()],
    ["totalMargin", getU64Decoder7()],
    ["openInterest", getU64Decoder7()],
    ["accruedFees", getU64Decoder7()],
    ["price", getU64Decoder7()],
    ["twap", getU64Decoder7()],
    ["priceSlot", getU64Decoder7()],
    ["priceTimestamp", getI64Decoder5()]
  ]);
}
function getMarketCodec() {
  return combineCodec8(getMarketEncoder(), getMarketDecoder());
}
function decodeMarket(encodedAccount) {
  return decodeAccount6(
    encodedAccount,
    getMarketDecoder()
  );
}
async function fetchMarket(rpc, address, config) {
  const maybeAccount = await fetchMaybeMarket(rpc, address, config);
  assertAccountExists6(maybeAccount);
  return maybeAccount;
}
async function fetchMaybeMarket(rpc, address, config) {
  const maybeAccount = await fetchEncodedAccount6(
    "rpc" in rpc ? rpc.rpc : rpc,
    typeof address === "string" ? address : address.address,
    config
  );
  return decodeMarket(maybeAccount);
}
async function fetchAllMarket(rpc, addresses, config) {
  const maybeAccounts = await fetchAllMaybeMarket(rpc, addresses, config);
  assertAccountsExist6(maybeAccounts);
  return maybeAccounts;
}
async function fetchAllMaybeMarket(rpc, addresses, config) {
  const maybeAccounts = await fetchEncodedAccounts6(
    "rpc" in rpc ? rpc.rpc : rpc,
    addresses.map((a) => typeof a === "string" ? a : a.address),
    config
  );
  return maybeAccounts.map((maybeAccount) => decodeMarket(maybeAccount));
}
function getMarketSize() {
  return 401;
}

// clients/generated/accounts/position.ts
import {
  assertAccountExists as assertAccountExists7,
  assertAccountsExist as assertAccountsExist7,
  combineCodec as combineCodec9,
  decodeAccount as decodeAccount7,
  fetchEncodedAccount as fetchEncodedAccount7,
  fetchEncodedAccounts as fetchEncodedAccounts7,
  fixDecoderSize as fixDecoderSize8,
  fixEncoderSize as fixEncoderSize8,
  getAddressDecoder as getAddressDecoder9,
  getAddressEncoder as getAddressEncoder9,
  getBooleanDecoder as getBooleanDecoder5,
  getBooleanEncoder as getBooleanEncoder5,
  getBytesDecoder as getBytesDecoder8,
  getBytesEncoder as getBytesEncoder8,
  getStructDecoder as getStructDecoder9,
  getStructEncoder as getStructEncoder9,
  getU64Decoder as getU64Decoder8,
  getU64Encoder as getU64Encoder8,
  getU8Decoder as getU8Decoder7,
  getU8Encoder as getU8Encoder7,
  transformEncoder as transformEncoder7
} from "@solana/kit";
var POSITION_DISCRIMINATOR = new Uint8Array([
  170,
  188,
  143,
  228,
  122,
  64,
  247,
  208
]);
function getPositionDiscriminatorBytes() {
  return fixEncoderSize8(getBytesEncoder8(), 8).encode(POSITION_DISCRIMINATOR);
}
function getPositionEncoder() {
  return transformEncoder7(
    getStructEncoder9([
      ["discriminator", fixEncoderSize8(getBytesEncoder8(), 8)],
      ["market", getAddressEncoder9()],
      ["marginAccount", getAddressEncoder9()],
      ["owner", getAddressEncoder9()],
      ["id", getU64Encoder8()],
      ["long", getBooleanEncoder5()],
      ["collateral", getU64Encoder8()],
      ["notional", getU64Encoder8()],
      ["entryPrice", getU64Encoder8()],
      ["reservedProfit", getU64Encoder8()],
      ["openedSlot", getU64Encoder8()],
      ["closed", getBooleanEncoder5()],
      ["exitPrice", getU64Encoder8()],
      ["payout", getU64Encoder8()],
      ["reason", getU8Encoder7()]
    ]),
    (value) => ({ ...value, discriminator: POSITION_DISCRIMINATOR })
  );
}
function getPositionDecoder() {
  return getStructDecoder9([
    ["discriminator", fixDecoderSize8(getBytesDecoder8(), 8)],
    ["market", getAddressDecoder9()],
    ["marginAccount", getAddressDecoder9()],
    ["owner", getAddressDecoder9()],
    ["id", getU64Decoder8()],
    ["long", getBooleanDecoder5()],
    ["collateral", getU64Decoder8()],
    ["notional", getU64Decoder8()],
    ["entryPrice", getU64Decoder8()],
    ["reservedProfit", getU64Decoder8()],
    ["openedSlot", getU64Decoder8()],
    ["closed", getBooleanDecoder5()],
    ["exitPrice", getU64Decoder8()],
    ["payout", getU64Decoder8()],
    ["reason", getU8Decoder7()]
  ]);
}
function getPositionCodec() {
  return combineCodec9(getPositionEncoder(), getPositionDecoder());
}
function decodePosition(encodedAccount) {
  return decodeAccount7(
    encodedAccount,
    getPositionDecoder()
  );
}
async function fetchPosition(rpc, address, config) {
  const maybeAccount = await fetchMaybePosition(rpc, address, config);
  assertAccountExists7(maybeAccount);
  return maybeAccount;
}
async function fetchMaybePosition(rpc, address, config) {
  const maybeAccount = await fetchEncodedAccount7(
    "rpc" in rpc ? rpc.rpc : rpc,
    typeof address === "string" ? address : address.address,
    config
  );
  return decodePosition(maybeAccount);
}
async function fetchAllPosition(rpc, addresses, config) {
  const maybeAccounts = await fetchAllMaybePosition(rpc, addresses, config);
  assertAccountsExist7(maybeAccounts);
  return maybeAccounts;
}
async function fetchAllMaybePosition(rpc, addresses, config) {
  const maybeAccounts = await fetchEncodedAccounts7(
    "rpc" in rpc ? rpc.rpc : rpc,
    addresses.map((a) => typeof a === "string" ? a : a.address),
    config
  );
  return maybeAccounts.map((maybeAccount) => decodePosition(maybeAccount));
}
function getPositionSize() {
  return 171;
}

// clients/generated/accounts/protocol.ts
import {
  assertAccountExists as assertAccountExists8,
  assertAccountsExist as assertAccountsExist8,
  combineCodec as combineCodec10,
  decodeAccount as decodeAccount8,
  fetchEncodedAccount as fetchEncodedAccount8,
  fetchEncodedAccounts as fetchEncodedAccounts8,
  fixDecoderSize as fixDecoderSize9,
  fixEncoderSize as fixEncoderSize9,
  getAddressDecoder as getAddressDecoder10,
  getAddressEncoder as getAddressEncoder10,
  getBooleanDecoder as getBooleanDecoder6,
  getBooleanEncoder as getBooleanEncoder6,
  getBytesDecoder as getBytesDecoder9,
  getBytesEncoder as getBytesEncoder9,
  getStructDecoder as getStructDecoder10,
  getStructEncoder as getStructEncoder10,
  getU64Decoder as getU64Decoder9,
  getU64Encoder as getU64Encoder9,
  getU8Decoder as getU8Decoder8,
  getU8Encoder as getU8Encoder8,
  transformEncoder as transformEncoder8
} from "@solana/kit";
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
  return fixEncoderSize9(getBytesEncoder9(), 8).encode(PROTOCOL_DISCRIMINATOR);
}
function getProtocolEncoder() {
  return transformEncoder8(
    getStructEncoder10([
      ["discriminator", fixEncoderSize9(getBytesEncoder9(), 8)],
      ["version", getU8Encoder8()],
      ["admin", getAddressEncoder10()],
      ["leverMint", getAddressEncoder10()],
      ["quoteMint", getAddressEncoder10()],
      ["policy", getListingPolicyEncoder()],
      ["paused", getBooleanEncoder6()],
      ["bump", getU8Encoder8()],
      ["totalBurned", getU64Encoder9()],
      ["listingCount", getU64Encoder9()],
      ["initialSupply", getU64Encoder9()],
      ["platformRevenue", getU64Encoder9()],
      ["tokenCreatorRevenue", getU64Encoder9()]
    ]),
    (value) => ({ ...value, discriminator: PROTOCOL_DISCRIMINATOR })
  );
}
function getProtocolDecoder() {
  return getStructDecoder10([
    ["discriminator", fixDecoderSize9(getBytesDecoder9(), 8)],
    ["version", getU8Decoder8()],
    ["admin", getAddressDecoder10()],
    ["leverMint", getAddressDecoder10()],
    ["quoteMint", getAddressDecoder10()],
    ["policy", getListingPolicyDecoder()],
    ["paused", getBooleanDecoder6()],
    ["bump", getU8Decoder8()],
    ["totalBurned", getU64Decoder9()],
    ["listingCount", getU64Decoder9()],
    ["initialSupply", getU64Decoder9()],
    ["platformRevenue", getU64Decoder9()],
    ["tokenCreatorRevenue", getU64Decoder9()]
  ]);
}
function getProtocolCodec() {
  return combineCodec10(getProtocolEncoder(), getProtocolDecoder());
}
function decodeProtocol(encodedAccount) {
  return decodeAccount8(
    encodedAccount,
    getProtocolDecoder()
  );
}
async function fetchProtocol(rpc, address, config) {
  const maybeAccount = await fetchMaybeProtocol(rpc, address, config);
  assertAccountExists8(maybeAccount);
  return maybeAccount;
}
async function fetchMaybeProtocol(rpc, address, config) {
  const maybeAccount = await fetchEncodedAccount8(
    "rpc" in rpc ? rpc.rpc : rpc,
    typeof address === "string" ? address : address.address,
    config
  );
  return decodeProtocol(maybeAccount);
}
async function fetchAllProtocol(rpc, addresses, config) {
  const maybeAccounts = await fetchAllMaybeProtocol(rpc, addresses, config);
  assertAccountsExist8(maybeAccounts);
  return maybeAccounts;
}
async function fetchAllMaybeProtocol(rpc, addresses, config) {
  const maybeAccounts = await fetchEncodedAccounts8(
    "rpc" in rpc ? rpc.rpc : rpc,
    addresses.map((a) => typeof a === "string" ? a : a.address),
    config
  );
  return maybeAccounts.map((maybeAccount) => decodeProtocol(maybeAccount));
}
function getProtocolSize() {
  return 269;
}

// clients/generated/accounts/revenueLedger.ts
import {
  assertAccountExists as assertAccountExists9,
  assertAccountsExist as assertAccountsExist9,
  combineCodec as combineCodec11,
  decodeAccount as decodeAccount9,
  fetchEncodedAccount as fetchEncodedAccount9,
  fetchEncodedAccounts as fetchEncodedAccounts9,
  fixDecoderSize as fixDecoderSize10,
  fixEncoderSize as fixEncoderSize10,
  getAddressDecoder as getAddressDecoder11,
  getAddressEncoder as getAddressEncoder11,
  getBytesDecoder as getBytesDecoder10,
  getBytesEncoder as getBytesEncoder10,
  getStructDecoder as getStructDecoder11,
  getStructEncoder as getStructEncoder11,
  getU64Decoder as getU64Decoder10,
  getU64Encoder as getU64Encoder10,
  transformEncoder as transformEncoder9
} from "@solana/kit";
var REVENUE_LEDGER_DISCRIMINATOR = new Uint8Array([
  28,
  159,
  94,
  108,
  184,
  213,
  62,
  53
]);
function getRevenueLedgerDiscriminatorBytes() {
  return fixEncoderSize10(getBytesEncoder10(), 8).encode(
    REVENUE_LEDGER_DISCRIMINATOR
  );
}
function getRevenueLedgerEncoder() {
  return transformEncoder9(
    getStructEncoder11([
      ["discriminator", fixEncoderSize10(getBytesEncoder10(), 8)],
      ["protocol", getAddressEncoder11()],
      ["nativeCreatorCollected", getU64Encoder10()],
      ["wsolCreatorCollected", getU64Encoder10()],
      ["quoteCreatorCollected", getU64Encoder10()],
      ["quoteBuybackSpent", getU64Encoder10()],
      ["wsolBuybackSpent", getU64Encoder10()],
      ["buybackBurned", getU64Encoder10()]
    ]),
    (value) => ({ ...value, discriminator: REVENUE_LEDGER_DISCRIMINATOR })
  );
}
function getRevenueLedgerDecoder() {
  return getStructDecoder11([
    ["discriminator", fixDecoderSize10(getBytesDecoder10(), 8)],
    ["protocol", getAddressDecoder11()],
    ["nativeCreatorCollected", getU64Decoder10()],
    ["wsolCreatorCollected", getU64Decoder10()],
    ["quoteCreatorCollected", getU64Decoder10()],
    ["quoteBuybackSpent", getU64Decoder10()],
    ["wsolBuybackSpent", getU64Decoder10()],
    ["buybackBurned", getU64Decoder10()]
  ]);
}
function getRevenueLedgerCodec() {
  return combineCodec11(getRevenueLedgerEncoder(), getRevenueLedgerDecoder());
}
function decodeRevenueLedger(encodedAccount) {
  return decodeAccount9(
    encodedAccount,
    getRevenueLedgerDecoder()
  );
}
async function fetchRevenueLedger(rpc, address, config) {
  const maybeAccount = await fetchMaybeRevenueLedger(rpc, address, config);
  assertAccountExists9(maybeAccount);
  return maybeAccount;
}
async function fetchMaybeRevenueLedger(rpc, address, config) {
  const maybeAccount = await fetchEncodedAccount9(
    "rpc" in rpc ? rpc.rpc : rpc,
    typeof address === "string" ? address : address.address,
    config
  );
  return decodeRevenueLedger(maybeAccount);
}
async function fetchAllRevenueLedger(rpc, addresses, config) {
  const maybeAccounts = await fetchAllMaybeRevenueLedger(
    rpc,
    addresses,
    config
  );
  assertAccountsExist9(maybeAccounts);
  return maybeAccounts;
}
async function fetchAllMaybeRevenueLedger(rpc, addresses, config) {
  const maybeAccounts = await fetchEncodedAccounts9(
    "rpc" in rpc ? rpc.rpc : rpc,
    addresses.map((a) => typeof a === "string" ? a : a.address),
    config
  );
  return maybeAccounts.map((maybeAccount) => decodeRevenueLedger(maybeAccount));
}
function getRevenueLedgerSize() {
  return 88;
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
  fixEncoderSize as fixEncoderSize39,
  getBytesEncoder as getBytesEncoder52,
  SOLANA_ERROR__PROGRAM_CLIENTS__FAILED_TO_IDENTIFY_ACCOUNT,
  SOLANA_ERROR__PROGRAM_CLIENTS__FAILED_TO_IDENTIFY_INSTRUCTION,
  SOLANA_ERROR__PROGRAM_CLIENTS__UNRECOGNIZED_INSTRUCTION_TYPE,
  SolanaError as SolanaError29
} from "@solana/kit";
import {
  addSelfFetchFunctions,
  addSelfPlanAndSendFunctions
} from "@solana/kit/program-client-core";

// clients/generated/instructions/approveListingPermit.ts
import {
  combineCodec as combineCodec12,
  fixDecoderSize as fixDecoderSize11,
  fixEncoderSize as fixEncoderSize11,
  getBytesDecoder as getBytesDecoder11,
  getBytesEncoder as getBytesEncoder24,
  getI64Decoder as getI64Decoder6,
  getI64Encoder as getI64Encoder6,
  getStructDecoder as getStructDecoder12,
  getStructEncoder as getStructEncoder12,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS,
  SolanaError,
  transformEncoder as transformEncoder10
} from "@solana/kit";
import {
  getAccountMetaFactory,
  getAddressFromResolvedInstructionAccount
} from "@solana/kit/program-client-core";

// clients/generated/pdas/airdropVault.ts
import {
  getAddressEncoder as getAddressEncoder12,
  getBytesEncoder as getBytesEncoder11,
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
      getBytesEncoder11().encode(
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
      getAddressEncoder12().encode(seeds.campaign)
    ]
  });
}

// clients/generated/pdas/baseVault.ts
import {
  getAddressEncoder as getAddressEncoder13,
  getBytesEncoder as getBytesEncoder12,
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
      getBytesEncoder12().encode(
        new Uint8Array([98, 97, 115, 101, 45, 118, 97, 117, 108, 116])
      ),
      getAddressEncoder13().encode(seeds.listing)
    ]
  });
}

// clients/generated/pdas/campaign.ts
import {
  getAddressEncoder as getAddressEncoder14,
  getBytesEncoder as getBytesEncoder13,
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
      getBytesEncoder13().encode(
        new Uint8Array([97, 105, 114, 100, 114, 111, 112])
      ),
      getAddressEncoder14().encode(seeds.protocol)
    ]
  });
}

// clients/generated/pdas/claim.ts
import {
  getAddressEncoder as getAddressEncoder15,
  getBytesEncoder as getBytesEncoder14,
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
      getBytesEncoder14().encode(new Uint8Array([99, 108, 97, 105, 109])),
      getAddressEncoder15().encode(seeds.campaign),
      getAddressEncoder15().encode(seeds.owner)
    ]
  });
}

// clients/generated/pdas/listing.ts
import {
  getAddressEncoder as getAddressEncoder16,
  getBytesEncoder as getBytesEncoder15,
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
      getBytesEncoder15().encode(
        new Uint8Array([108, 105, 115, 116, 105, 110, 103])
      ),
      getAddressEncoder16().encode(seeds.protocol),
      getAddressEncoder16().encode(seeds.baseMint)
    ]
  });
}

// clients/generated/pdas/margin.ts
import {
  getAddressEncoder as getAddressEncoder17,
  getBytesEncoder as getBytesEncoder16,
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
      getBytesEncoder16().encode(new Uint8Array([109, 97, 114, 103, 105, 110])),
      getAddressEncoder17().encode(seeds.protocol),
      getAddressEncoder17().encode(seeds.owner)
    ]
  });
}

// clients/generated/pdas/market.ts
import {
  getAddressEncoder as getAddressEncoder18,
  getBytesEncoder as getBytesEncoder17,
  getProgramDerivedAddress as getProgramDerivedAddress7
} from "@solana/kit";
async function findMarketPda(seeds, config = {}) {
  const {
    programAddress: programAddressInput = "Fg6PaFpoGXkYsidMpWxTWqkZ7FEfcYkgMQhgS1h5A9t"
  } = config;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  return await getProgramDerivedAddress7({
    programAddress,
    seeds: [
      getBytesEncoder17().encode(new Uint8Array([109, 97, 114, 107, 101, 116])),
      getAddressEncoder18().encode(seeds.listing)
    ]
  });
}

// clients/generated/pdas/marketVault.ts
import {
  getAddressEncoder as getAddressEncoder19,
  getBytesEncoder as getBytesEncoder18,
  getProgramDerivedAddress as getProgramDerivedAddress8
} from "@solana/kit";
async function findMarketVaultPda(seeds, config = {}) {
  const {
    programAddress: programAddressInput = "Fg6PaFpoGXkYsidMpWxTWqkZ7FEfcYkgMQhgS1h5A9t"
  } = config;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  return await getProgramDerivedAddress8({
    programAddress,
    seeds: [
      getBytesEncoder18().encode(
        new Uint8Array([
          109,
          97,
          114,
          107,
          101,
          116,
          45,
          118,
          97,
          117,
          108,
          116
        ])
      ),
      getAddressEncoder19().encode(seeds.market)
    ]
  });
}

// clients/generated/pdas/permit.ts
import {
  getAddressEncoder as getAddressEncoder20,
  getBytesEncoder as getBytesEncoder19,
  getProgramDerivedAddress as getProgramDerivedAddress9
} from "@solana/kit";
async function findPermitPda(seeds, config = {}) {
  const {
    programAddress: programAddressInput = "Fg6PaFpoGXkYsidMpWxTWqkZ7FEfcYkgMQhgS1h5A9t"
  } = config;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  return await getProgramDerivedAddress9({
    programAddress,
    seeds: [
      getBytesEncoder19().encode(
        new Uint8Array([
          108,
          105,
          115,
          116,
          105,
          110,
          103,
          45,
          112,
          101,
          114,
          109,
          105,
          116
        ])
      ),
      getAddressEncoder20().encode(seeds.protocol),
      getAddressEncoder20().encode(seeds.baseMint),
      getAddressEncoder20().encode(seeds.lister)
    ]
  });
}

// clients/generated/pdas/position.ts
import {
  getAddressEncoder as getAddressEncoder21,
  getBytesEncoder as getBytesEncoder20,
  getProgramDerivedAddress as getProgramDerivedAddress10,
  getU64Encoder as getU64Encoder11
} from "@solana/kit";
async function findPositionPda(seeds, config = {}) {
  const {
    programAddress: programAddressInput = "Fg6PaFpoGXkYsidMpWxTWqkZ7FEfcYkgMQhgS1h5A9t"
  } = config;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  return await getProgramDerivedAddress10({
    programAddress,
    seeds: [
      getBytesEncoder20().encode(
        new Uint8Array([112, 111, 115, 105, 116, 105, 111, 110])
      ),
      getAddressEncoder21().encode(seeds.margin),
      getU64Encoder11().encode(seeds.id)
    ]
  });
}

// clients/generated/pdas/protocol.ts
import {
  getAddressEncoder as getAddressEncoder22,
  getBytesEncoder as getBytesEncoder21,
  getProgramDerivedAddress as getProgramDerivedAddress11
} from "@solana/kit";
async function findProtocolPda(seeds, config = {}) {
  const {
    programAddress: programAddressInput = "Fg6PaFpoGXkYsidMpWxTWqkZ7FEfcYkgMQhgS1h5A9t"
  } = config;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  return await getProgramDerivedAddress11({
    programAddress,
    seeds: [
      getBytesEncoder21().encode(
        new Uint8Array([112, 114, 111, 116, 111, 99, 111, 108])
      ),
      getAddressEncoder22().encode(seeds.admin)
    ]
  });
}

// clients/generated/pdas/quoteVault.ts
import {
  getAddressEncoder as getAddressEncoder23,
  getBytesEncoder as getBytesEncoder22,
  getProgramDerivedAddress as getProgramDerivedAddress12
} from "@solana/kit";
async function findQuoteVaultPda(seeds, config = {}) {
  const {
    programAddress: programAddressInput = "Fg6PaFpoGXkYsidMpWxTWqkZ7FEfcYkgMQhgS1h5A9t"
  } = config;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  return await getProgramDerivedAddress12({
    programAddress,
    seeds: [
      getBytesEncoder22().encode(
        new Uint8Array([113, 117, 111, 116, 101, 45, 118, 97, 117, 108, 116])
      ),
      getAddressEncoder23().encode(seeds.margin)
    ]
  });
}

// clients/generated/pdas/revenue.ts
import {
  getAddressEncoder as getAddressEncoder24,
  getBytesEncoder as getBytesEncoder23,
  getProgramDerivedAddress as getProgramDerivedAddress13
} from "@solana/kit";
async function findRevenuePda(seeds, config = {}) {
  const {
    programAddress: programAddressInput = "Fg6PaFpoGXkYsidMpWxTWqkZ7FEfcYkgMQhgS1h5A9t"
  } = config;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  return await getProgramDerivedAddress13({
    programAddress,
    seeds: [
      getBytesEncoder23().encode(
        new Uint8Array([114, 101, 118, 101, 110, 117, 101])
      ),
      getAddressEncoder24().encode(seeds.protocol)
    ]
  });
}

// clients/generated/instructions/approveListingPermit.ts
var APPROVE_LISTING_PERMIT_DISCRIMINATOR = new Uint8Array([155, 67, 86, 117, 115, 161, 112, 127]);
function getApproveListingPermitDiscriminatorBytes() {
  return fixEncoderSize11(getBytesEncoder24(), 8).encode(
    APPROVE_LISTING_PERMIT_DISCRIMINATOR
  );
}
function getApproveListingPermitInstructionDataEncoder() {
  return transformEncoder10(
    getStructEncoder12([
      ["discriminator", fixEncoderSize11(getBytesEncoder24(), 8)],
      ["expiresAt", getI64Encoder6()]
    ]),
    (value) => ({
      ...value,
      discriminator: APPROVE_LISTING_PERMIT_DISCRIMINATOR
    })
  );
}
function getApproveListingPermitInstructionDataDecoder() {
  return getStructDecoder12([
    ["discriminator", fixDecoderSize11(getBytesDecoder11(), 8)],
    ["expiresAt", getI64Decoder6()]
  ]);
}
function getApproveListingPermitInstructionDataCodec() {
  return combineCodec12(
    getApproveListingPermitInstructionDataEncoder(),
    getApproveListingPermitInstructionDataDecoder()
  );
}
async function getApproveListingPermitInstructionAsync(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory(programAddress, "programId");
  const originalAccounts = {
    admin: { value: input.admin ?? null, isSigner: true, isWritable: true },
    protocol: {
      value: input.protocol ?? null,
      isSigner: false,
      isWritable: false
    },
    baseMint: {
      value: input.baseMint ?? null,
      isSigner: false,
      isWritable: false
    },
    lister: { value: input.lister ?? null, isSigner: false, isWritable: false },
    permit: { value: input.permit ?? null, isSigner: false, isWritable: true },
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
        admin: getAddressFromResolvedInstructionAccount(
          "admin",
          accounts.admin.value
        )
      },
      { programAddress }
    );
  }
  if (!accounts.permit.value) {
    accounts.permit.value = await findPermitPda(
      {
        protocol: getAddressFromResolvedInstructionAccount(
          "protocol",
          accounts.protocol.value
        ),
        baseMint: getAddressFromResolvedInstructionAccount(
          "baseMint",
          accounts.baseMint.value
        ),
        lister: getAddressFromResolvedInstructionAccount(
          "lister",
          accounts.lister.value
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
      getAccountMeta("baseMint", accounts.baseMint),
      getAccountMeta("lister", accounts.lister),
      getAccountMeta("permit", accounts.permit),
      getAccountMeta("systemProgram", accounts.systemProgram)
    ],
    data: getApproveListingPermitInstructionDataEncoder().encode(
      args
    ),
    programAddress
  });
}
function getApproveListingPermitInstruction(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory(programAddress, "programId");
  const originalAccounts = {
    admin: { value: input.admin ?? null, isSigner: true, isWritable: true },
    protocol: {
      value: input.protocol ?? null,
      isSigner: false,
      isWritable: false
    },
    baseMint: {
      value: input.baseMint ?? null,
      isSigner: false,
      isWritable: false
    },
    lister: { value: input.lister ?? null, isSigner: false, isWritable: false },
    permit: { value: input.permit ?? null, isSigner: false, isWritable: true },
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
      getAccountMeta("baseMint", accounts.baseMint),
      getAccountMeta("lister", accounts.lister),
      getAccountMeta("permit", accounts.permit),
      getAccountMeta("systemProgram", accounts.systemProgram)
    ],
    data: getApproveListingPermitInstructionDataEncoder().encode(
      args
    ),
    programAddress
  });
}
function parseApproveListingPermitInstruction(instruction) {
  if (instruction.accounts.length < 6) {
    throw new SolanaError(
      SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS,
      {
        actualAccountMetas: instruction.accounts.length,
        expectedAccountMetas: 6
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
      baseMint: getNextAccount(),
      lister: getNextAccount(),
      permit: getNextAccount(),
      systemProgram: getNextAccount()
    },
    data: getApproveListingPermitInstructionDataDecoder().decode(
      instruction.data
    )
  };
}

// clients/generated/instructions/cancelListing.ts
import {
  combineCodec as combineCodec13,
  fixDecoderSize as fixDecoderSize12,
  fixEncoderSize as fixEncoderSize12,
  getBytesDecoder as getBytesDecoder12,
  getBytesEncoder as getBytesEncoder25,
  getStructDecoder as getStructDecoder13,
  getStructEncoder as getStructEncoder13,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS2,
  SolanaError as SolanaError2,
  transformEncoder as transformEncoder11
} from "@solana/kit";
import {
  getAccountMetaFactory as getAccountMetaFactory2,
  getAddressFromResolvedInstructionAccount as getAddressFromResolvedInstructionAccount2
} from "@solana/kit/program-client-core";
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
  return fixEncoderSize12(getBytesEncoder25(), 8).encode(
    CANCEL_LISTING_DISCRIMINATOR
  );
}
function getCancelListingInstructionDataEncoder() {
  return transformEncoder11(
    getStructEncoder13([["discriminator", fixEncoderSize12(getBytesEncoder25(), 8)]]),
    (value) => ({ ...value, discriminator: CANCEL_LISTING_DISCRIMINATOR })
  );
}
function getCancelListingInstructionDataDecoder() {
  return getStructDecoder13([
    ["discriminator", fixDecoderSize12(getBytesDecoder12(), 8)]
  ]);
}
function getCancelListingInstructionDataCodec() {
  return combineCodec13(
    getCancelListingInstructionDataEncoder(),
    getCancelListingInstructionDataDecoder()
  );
}
async function getCancelListingInstructionAsync(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory2(programAddress, "programId");
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
        protocol: getAddressFromResolvedInstructionAccount2(
          "protocol",
          accounts.protocol.value
        ),
        baseMint: getAddressFromResolvedInstructionAccount2(
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
        listing: getAddressFromResolvedInstructionAccount2(
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
  const getAccountMeta = getAccountMetaFactory2(programAddress, "programId");
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
    throw new SolanaError2(
      SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS2,
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
  combineCodec as combineCodec14,
  fixDecoderSize as fixDecoderSize13,
  fixEncoderSize as fixEncoderSize13,
  getArrayDecoder as getArrayDecoder2,
  getArrayEncoder as getArrayEncoder2,
  getBytesDecoder as getBytesDecoder13,
  getBytesEncoder as getBytesEncoder26,
  getStructDecoder as getStructDecoder14,
  getStructEncoder as getStructEncoder14,
  getU64Decoder as getU64Decoder11,
  getU64Encoder as getU64Encoder12,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS3,
  SolanaError as SolanaError3,
  transformEncoder as transformEncoder12
} from "@solana/kit";
import {
  getAccountMetaFactory as getAccountMetaFactory3,
  getAddressFromResolvedInstructionAccount as getAddressFromResolvedInstructionAccount3
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
  return fixEncoderSize13(getBytesEncoder26(), 8).encode(
    CLAIM_AIRDROP_DISCRIMINATOR
  );
}
function getClaimAirdropInstructionDataEncoder() {
  return transformEncoder12(
    getStructEncoder14([
      ["discriminator", fixEncoderSize13(getBytesEncoder26(), 8)],
      ["index", getU64Encoder12()],
      ["amount", getU64Encoder12()],
      ["proof", getArrayEncoder2(fixEncoderSize13(getBytesEncoder26(), 32))]
    ]),
    (value) => ({ ...value, discriminator: CLAIM_AIRDROP_DISCRIMINATOR })
  );
}
function getClaimAirdropInstructionDataDecoder() {
  return getStructDecoder14([
    ["discriminator", fixDecoderSize13(getBytesDecoder13(), 8)],
    ["index", getU64Decoder11()],
    ["amount", getU64Decoder11()],
    ["proof", getArrayDecoder2(fixDecoderSize13(getBytesDecoder13(), 32))]
  ]);
}
function getClaimAirdropInstructionDataCodec() {
  return combineCodec14(
    getClaimAirdropInstructionDataEncoder(),
    getClaimAirdropInstructionDataDecoder()
  );
}
async function getClaimAirdropInstructionAsync(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory3(programAddress, "programId");
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
        protocol: getAddressFromResolvedInstructionAccount3(
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
        campaign: getAddressFromResolvedInstructionAccount3(
          "campaign",
          accounts.campaign.value
        ),
        owner: getAddressFromResolvedInstructionAccount3(
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
  const getAccountMeta = getAccountMetaFactory3(programAddress, "programId");
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
    throw new SolanaError3(
      SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS3,
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

// clients/generated/instructions/collectMarketFees.ts
import {
  combineCodec as combineCodec15,
  fixDecoderSize as fixDecoderSize14,
  fixEncoderSize as fixEncoderSize14,
  getBytesDecoder as getBytesDecoder14,
  getBytesEncoder as getBytesEncoder27,
  getStructDecoder as getStructDecoder15,
  getStructEncoder as getStructEncoder15,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS4,
  SolanaError as SolanaError4,
  transformEncoder as transformEncoder13
} from "@solana/kit";
import {
  getAccountMetaFactory as getAccountMetaFactory4,
  getAddressFromResolvedInstructionAccount as getAddressFromResolvedInstructionAccount4
} from "@solana/kit/program-client-core";
var COLLECT_MARKET_FEES_DISCRIMINATOR = new Uint8Array([91, 210, 175, 55, 51, 117, 137, 238]);
function getCollectMarketFeesDiscriminatorBytes() {
  return fixEncoderSize14(getBytesEncoder27(), 8).encode(
    COLLECT_MARKET_FEES_DISCRIMINATOR
  );
}
function getCollectMarketFeesInstructionDataEncoder() {
  return transformEncoder13(
    getStructEncoder15([["discriminator", fixEncoderSize14(getBytesEncoder27(), 8)]]),
    (value) => ({ ...value, discriminator: COLLECT_MARKET_FEES_DISCRIMINATOR })
  );
}
function getCollectMarketFeesInstructionDataDecoder() {
  return getStructDecoder15([
    ["discriminator", fixDecoderSize14(getBytesDecoder14(), 8)]
  ]);
}
function getCollectMarketFeesInstructionDataCodec() {
  return combineCodec15(
    getCollectMarketFeesInstructionDataEncoder(),
    getCollectMarketFeesInstructionDataDecoder()
  );
}
async function getCollectMarketFeesInstructionAsync(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory4(programAddress, "programId");
  const originalAccounts = {
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
    market: { value: input.market ?? null, isSigner: false, isWritable: true },
    quoteMint: {
      value: input.quoteMint ?? null,
      isSigner: false,
      isWritable: false
    },
    marketVault: {
      value: input.marketVault ?? null,
      isSigner: false,
      isWritable: true
    },
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
  if (!accounts.market.value) {
    accounts.market.value = await findMarketPda(
      {
        listing: getAddressFromResolvedInstructionAccount4(
          "listing",
          accounts.listing.value
        )
      },
      { programAddress }
    );
  }
  if (!accounts.marketVault.value) {
    accounts.marketVault.value = await findMarketVaultPda(
      {
        market: getAddressFromResolvedInstructionAccount4(
          "market",
          accounts.market.value
        )
      },
      { programAddress }
    );
  }
  return Object.freeze({
    accounts: [
      getAccountMeta("protocol", accounts.protocol),
      getAccountMeta("listing", accounts.listing),
      getAccountMeta("market", accounts.market),
      getAccountMeta("quoteMint", accounts.quoteMint),
      getAccountMeta("marketVault", accounts.marketVault),
      getAccountMeta("treasury", accounts.treasury),
      getAccountMeta("campaignFund", accounts.campaignFund),
      getAccountMeta("creator", accounts.creator),
      getAccountMeta("buybackFund", accounts.buybackFund),
      getAccountMeta("quoteProgram", accounts.quoteProgram)
    ],
    data: getCollectMarketFeesInstructionDataEncoder().encode({}),
    programAddress
  });
}
function getCollectMarketFeesInstruction(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory4(programAddress, "programId");
  const originalAccounts = {
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
    market: { value: input.market ?? null, isSigner: false, isWritable: true },
    quoteMint: {
      value: input.quoteMint ?? null,
      isSigner: false,
      isWritable: false
    },
    marketVault: {
      value: input.marketVault ?? null,
      isSigner: false,
      isWritable: true
    },
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
  return Object.freeze({
    accounts: [
      getAccountMeta("protocol", accounts.protocol),
      getAccountMeta("listing", accounts.listing),
      getAccountMeta("market", accounts.market),
      getAccountMeta("quoteMint", accounts.quoteMint),
      getAccountMeta("marketVault", accounts.marketVault),
      getAccountMeta("treasury", accounts.treasury),
      getAccountMeta("campaignFund", accounts.campaignFund),
      getAccountMeta("creator", accounts.creator),
      getAccountMeta("buybackFund", accounts.buybackFund),
      getAccountMeta("quoteProgram", accounts.quoteProgram)
    ],
    data: getCollectMarketFeesInstructionDataEncoder().encode({}),
    programAddress
  });
}
function parseCollectMarketFeesInstruction(instruction) {
  if (instruction.accounts.length < 10) {
    throw new SolanaError4(
      SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS4,
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
      protocol: getNextAccount(),
      listing: getNextAccount(),
      market: getNextAccount(),
      quoteMint: getNextAccount(),
      marketVault: getNextAccount(),
      treasury: getNextAccount(),
      campaignFund: getNextAccount(),
      creator: getNextAccount(),
      buybackFund: getNextAccount(),
      quoteProgram: getNextAccount()
    },
    data: getCollectMarketFeesInstructionDataDecoder().decode(instruction.data)
  };
}

// clients/generated/instructions/collectNativeCreatorFees.ts
import {
  combineCodec as combineCodec16,
  fixDecoderSize as fixDecoderSize15,
  fixEncoderSize as fixEncoderSize15,
  getBytesDecoder as getBytesDecoder15,
  getBytesEncoder as getBytesEncoder28,
  getStructDecoder as getStructDecoder16,
  getStructEncoder as getStructEncoder16,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS5,
  SolanaError as SolanaError5,
  transformEncoder as transformEncoder14
} from "@solana/kit";
import {
  getAccountMetaFactory as getAccountMetaFactory5,
  getAddressFromResolvedInstructionAccount as getAddressFromResolvedInstructionAccount5
} from "@solana/kit/program-client-core";
var COLLECT_NATIVE_CREATOR_FEES_DISCRIMINATOR = new Uint8Array([220, 242, 50, 172, 89, 68, 83, 38]);
function getCollectNativeCreatorFeesDiscriminatorBytes() {
  return fixEncoderSize15(getBytesEncoder28(), 8).encode(
    COLLECT_NATIVE_CREATOR_FEES_DISCRIMINATOR
  );
}
function getCollectNativeCreatorFeesInstructionDataEncoder() {
  return transformEncoder14(
    getStructEncoder16([["discriminator", fixEncoderSize15(getBytesEncoder28(), 8)]]),
    (value) => ({
      ...value,
      discriminator: COLLECT_NATIVE_CREATOR_FEES_DISCRIMINATOR
    })
  );
}
function getCollectNativeCreatorFeesInstructionDataDecoder() {
  return getStructDecoder16([
    ["discriminator", fixDecoderSize15(getBytesDecoder15(), 8)]
  ]);
}
function getCollectNativeCreatorFeesInstructionDataCodec() {
  return combineCodec16(
    getCollectNativeCreatorFeesInstructionDataEncoder(),
    getCollectNativeCreatorFeesInstructionDataDecoder()
  );
}
async function getCollectNativeCreatorFeesInstructionAsync(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory5(programAddress, "programId");
  const originalAccounts = {
    creator: { value: input.creator ?? null, isSigner: true, isWritable: true },
    protocol: {
      value: input.protocol ?? null,
      isSigner: false,
      isWritable: false
    },
    revenue: {
      value: input.revenue ?? null,
      isSigner: false,
      isWritable: true
    },
    origin: { value: input.origin ?? null, isSigner: false, isWritable: false },
    creatorVault: {
      value: input.creatorVault ?? null,
      isSigner: false,
      isWritable: true
    },
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
    eventAuthority: {
      value: input.eventAuthority ?? null,
      isSigner: false,
      isWritable: false
    },
    pumpProgram: {
      value: input.pumpProgram ?? null,
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
  if (!accounts.revenue.value) {
    accounts.revenue.value = await findRevenuePda(
      {
        protocol: getAddressFromResolvedInstructionAccount5(
          "protocol",
          accounts.protocol.value
        )
      },
      { programAddress }
    );
  }
  if (!accounts.pumpProgram.value) {
    accounts.pumpProgram.value = "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P";
  }
  if (!accounts.systemProgram.value) {
    accounts.systemProgram.value = "11111111111111111111111111111111";
  }
  return Object.freeze({
    accounts: [
      getAccountMeta("creator", accounts.creator),
      getAccountMeta("protocol", accounts.protocol),
      getAccountMeta("revenue", accounts.revenue),
      getAccountMeta("origin", accounts.origin),
      getAccountMeta("creatorVault", accounts.creatorVault),
      getAccountMeta("treasury", accounts.treasury),
      getAccountMeta("buybackFund", accounts.buybackFund),
      getAccountMeta("eventAuthority", accounts.eventAuthority),
      getAccountMeta("pumpProgram", accounts.pumpProgram),
      getAccountMeta("systemProgram", accounts.systemProgram)
    ],
    data: getCollectNativeCreatorFeesInstructionDataEncoder().encode({}),
    programAddress
  });
}
function getCollectNativeCreatorFeesInstruction(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory5(programAddress, "programId");
  const originalAccounts = {
    creator: { value: input.creator ?? null, isSigner: true, isWritable: true },
    protocol: {
      value: input.protocol ?? null,
      isSigner: false,
      isWritable: false
    },
    revenue: {
      value: input.revenue ?? null,
      isSigner: false,
      isWritable: true
    },
    origin: { value: input.origin ?? null, isSigner: false, isWritable: false },
    creatorVault: {
      value: input.creatorVault ?? null,
      isSigner: false,
      isWritable: true
    },
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
    eventAuthority: {
      value: input.eventAuthority ?? null,
      isSigner: false,
      isWritable: false
    },
    pumpProgram: {
      value: input.pumpProgram ?? null,
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
  if (!accounts.pumpProgram.value) {
    accounts.pumpProgram.value = "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P";
  }
  if (!accounts.systemProgram.value) {
    accounts.systemProgram.value = "11111111111111111111111111111111";
  }
  return Object.freeze({
    accounts: [
      getAccountMeta("creator", accounts.creator),
      getAccountMeta("protocol", accounts.protocol),
      getAccountMeta("revenue", accounts.revenue),
      getAccountMeta("origin", accounts.origin),
      getAccountMeta("creatorVault", accounts.creatorVault),
      getAccountMeta("treasury", accounts.treasury),
      getAccountMeta("buybackFund", accounts.buybackFund),
      getAccountMeta("eventAuthority", accounts.eventAuthority),
      getAccountMeta("pumpProgram", accounts.pumpProgram),
      getAccountMeta("systemProgram", accounts.systemProgram)
    ],
    data: getCollectNativeCreatorFeesInstructionDataEncoder().encode({}),
    programAddress
  });
}
function parseCollectNativeCreatorFeesInstruction(instruction) {
  if (instruction.accounts.length < 10) {
    throw new SolanaError5(
      SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS5,
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
      creator: getNextAccount(),
      protocol: getNextAccount(),
      revenue: getNextAccount(),
      origin: getNextAccount(),
      creatorVault: getNextAccount(),
      treasury: getNextAccount(),
      buybackFund: getNextAccount(),
      eventAuthority: getNextAccount(),
      pumpProgram: getNextAccount(),
      systemProgram: getNextAccount()
    },
    data: getCollectNativeCreatorFeesInstructionDataDecoder().decode(
      instruction.data
    )
  };
}

// clients/generated/instructions/collectQuoteCreatorFees.ts
import {
  combineCodec as combineCodec17,
  fixDecoderSize as fixDecoderSize16,
  fixEncoderSize as fixEncoderSize16,
  getAddressEncoder as getAddressEncoder25,
  getBytesDecoder as getBytesDecoder16,
  getBytesEncoder as getBytesEncoder29,
  getProgramDerivedAddress as getProgramDerivedAddress14,
  getStructDecoder as getStructDecoder17,
  getStructEncoder as getStructEncoder17,
  getU8Decoder as getU8Decoder9,
  getU8Encoder as getU8Encoder9,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS6,
  SolanaError as SolanaError6,
  transformEncoder as transformEncoder15
} from "@solana/kit";
import {
  getAccountMetaFactory as getAccountMetaFactory6,
  getAddressFromResolvedInstructionAccount as getAddressFromResolvedInstructionAccount6
} from "@solana/kit/program-client-core";
var COLLECT_QUOTE_CREATOR_FEES_DISCRIMINATOR = new Uint8Array([103, 255, 90, 194, 192, 129, 92, 158]);
function getCollectQuoteCreatorFeesDiscriminatorBytes() {
  return fixEncoderSize16(getBytesEncoder29(), 8).encode(
    COLLECT_QUOTE_CREATOR_FEES_DISCRIMINATOR
  );
}
function getCollectQuoteCreatorFeesInstructionDataEncoder() {
  return transformEncoder15(
    getStructEncoder17([
      ["discriminator", fixEncoderSize16(getBytesEncoder29(), 8)],
      ["sourceKind", getU8Encoder9()]
    ]),
    (value) => ({
      ...value,
      discriminator: COLLECT_QUOTE_CREATOR_FEES_DISCRIMINATOR
    })
  );
}
function getCollectQuoteCreatorFeesInstructionDataDecoder() {
  return getStructDecoder17([
    ["discriminator", fixDecoderSize16(getBytesDecoder16(), 8)],
    ["sourceKind", getU8Decoder9()]
  ]);
}
function getCollectQuoteCreatorFeesInstructionDataCodec() {
  return combineCodec17(
    getCollectQuoteCreatorFeesInstructionDataEncoder(),
    getCollectQuoteCreatorFeesInstructionDataDecoder()
  );
}
async function getCollectQuoteCreatorFeesInstructionAsync(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory6(programAddress, "programId");
  const originalAccounts = {
    creator: { value: input.creator ?? null, isSigner: true, isWritable: true },
    protocol: {
      value: input.protocol ?? null,
      isSigner: false,
      isWritable: false
    },
    revenue: {
      value: input.revenue ?? null,
      isSigner: false,
      isWritable: true
    },
    origin: { value: input.origin ?? null, isSigner: false, isWritable: false },
    inputMint: {
      value: input.inputMint ?? null,
      isSigner: false,
      isWritable: false
    },
    creatorTokens: {
      value: input.creatorTokens ?? null,
      isSigner: false,
      isWritable: true
    },
    vaultAuthority: {
      value: input.vaultAuthority ?? null,
      isSigner: false,
      isWritable: true
    },
    feeVault: {
      value: input.feeVault ?? null,
      isSigner: false,
      isWritable: true
    },
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
    feeProgram: {
      value: input.feeProgram ?? null,
      isSigner: false,
      isWritable: false
    },
    eventAuthority: {
      value: input.eventAuthority ?? null,
      isSigner: false,
      isWritable: false
    },
    inputProgram: {
      value: input.inputProgram ?? null,
      isSigner: false,
      isWritable: false
    },
    associatedTokenProgram: {
      value: input.associatedTokenProgram ?? null,
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
  if (!accounts.revenue.value) {
    accounts.revenue.value = await findRevenuePda(
      {
        protocol: getAddressFromResolvedInstructionAccount6(
          "protocol",
          accounts.protocol.value
        )
      },
      { programAddress }
    );
  }
  if (!accounts.feeVault.value) {
    accounts.feeVault.value = await getProgramDerivedAddress14({
      programAddress: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
      seeds: [
        getAddressEncoder25().encode(
          getAddressFromResolvedInstructionAccount6(
            "vaultAuthority",
            accounts.vaultAuthority.value
          )
        ),
        getAddressEncoder25().encode(
          getAddressFromResolvedInstructionAccount6(
            "inputProgram",
            accounts.inputProgram.value
          )
        ),
        getAddressEncoder25().encode(
          getAddressFromResolvedInstructionAccount6(
            "inputMint",
            accounts.inputMint.value
          )
        )
      ]
    });
  }
  if (!accounts.associatedTokenProgram.value) {
    accounts.associatedTokenProgram.value = "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
  }
  if (!accounts.systemProgram.value) {
    accounts.systemProgram.value = "11111111111111111111111111111111";
  }
  return Object.freeze({
    accounts: [
      getAccountMeta("creator", accounts.creator),
      getAccountMeta("protocol", accounts.protocol),
      getAccountMeta("revenue", accounts.revenue),
      getAccountMeta("origin", accounts.origin),
      getAccountMeta("inputMint", accounts.inputMint),
      getAccountMeta("creatorTokens", accounts.creatorTokens),
      getAccountMeta("vaultAuthority", accounts.vaultAuthority),
      getAccountMeta("feeVault", accounts.feeVault),
      getAccountMeta("treasury", accounts.treasury),
      getAccountMeta("buybackFund", accounts.buybackFund),
      getAccountMeta("feeProgram", accounts.feeProgram),
      getAccountMeta("eventAuthority", accounts.eventAuthority),
      getAccountMeta("inputProgram", accounts.inputProgram),
      getAccountMeta("associatedTokenProgram", accounts.associatedTokenProgram),
      getAccountMeta("systemProgram", accounts.systemProgram)
    ],
    data: getCollectQuoteCreatorFeesInstructionDataEncoder().encode(
      args
    ),
    programAddress
  });
}
function getCollectQuoteCreatorFeesInstruction(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory6(programAddress, "programId");
  const originalAccounts = {
    creator: { value: input.creator ?? null, isSigner: true, isWritable: true },
    protocol: {
      value: input.protocol ?? null,
      isSigner: false,
      isWritable: false
    },
    revenue: {
      value: input.revenue ?? null,
      isSigner: false,
      isWritable: true
    },
    origin: { value: input.origin ?? null, isSigner: false, isWritable: false },
    inputMint: {
      value: input.inputMint ?? null,
      isSigner: false,
      isWritable: false
    },
    creatorTokens: {
      value: input.creatorTokens ?? null,
      isSigner: false,
      isWritable: true
    },
    vaultAuthority: {
      value: input.vaultAuthority ?? null,
      isSigner: false,
      isWritable: true
    },
    feeVault: {
      value: input.feeVault ?? null,
      isSigner: false,
      isWritable: true
    },
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
    feeProgram: {
      value: input.feeProgram ?? null,
      isSigner: false,
      isWritable: false
    },
    eventAuthority: {
      value: input.eventAuthority ?? null,
      isSigner: false,
      isWritable: false
    },
    inputProgram: {
      value: input.inputProgram ?? null,
      isSigner: false,
      isWritable: false
    },
    associatedTokenProgram: {
      value: input.associatedTokenProgram ?? null,
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
  if (!accounts.associatedTokenProgram.value) {
    accounts.associatedTokenProgram.value = "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
  }
  if (!accounts.systemProgram.value) {
    accounts.systemProgram.value = "11111111111111111111111111111111";
  }
  return Object.freeze({
    accounts: [
      getAccountMeta("creator", accounts.creator),
      getAccountMeta("protocol", accounts.protocol),
      getAccountMeta("revenue", accounts.revenue),
      getAccountMeta("origin", accounts.origin),
      getAccountMeta("inputMint", accounts.inputMint),
      getAccountMeta("creatorTokens", accounts.creatorTokens),
      getAccountMeta("vaultAuthority", accounts.vaultAuthority),
      getAccountMeta("feeVault", accounts.feeVault),
      getAccountMeta("treasury", accounts.treasury),
      getAccountMeta("buybackFund", accounts.buybackFund),
      getAccountMeta("feeProgram", accounts.feeProgram),
      getAccountMeta("eventAuthority", accounts.eventAuthority),
      getAccountMeta("inputProgram", accounts.inputProgram),
      getAccountMeta("associatedTokenProgram", accounts.associatedTokenProgram),
      getAccountMeta("systemProgram", accounts.systemProgram)
    ],
    data: getCollectQuoteCreatorFeesInstructionDataEncoder().encode(
      args
    ),
    programAddress
  });
}
function parseCollectQuoteCreatorFeesInstruction(instruction) {
  if (instruction.accounts.length < 15) {
    throw new SolanaError6(
      SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS6,
      {
        actualAccountMetas: instruction.accounts.length,
        expectedAccountMetas: 15
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
      creator: getNextAccount(),
      protocol: getNextAccount(),
      revenue: getNextAccount(),
      origin: getNextAccount(),
      inputMint: getNextAccount(),
      creatorTokens: getNextAccount(),
      vaultAuthority: getNextAccount(),
      feeVault: getNextAccount(),
      treasury: getNextAccount(),
      buybackFund: getNextAccount(),
      feeProgram: getNextAccount(),
      eventAuthority: getNextAccount(),
      inputProgram: getNextAccount(),
      associatedTokenProgram: getNextAccount(),
      systemProgram: getNextAccount()
    },
    data: getCollectQuoteCreatorFeesInstructionDataDecoder().decode(
      instruction.data
    )
  };
}

// clients/generated/instructions/createAirdrop.ts
import {
  combineCodec as combineCodec18,
  fixDecoderSize as fixDecoderSize17,
  fixEncoderSize as fixEncoderSize17,
  getBytesDecoder as getBytesDecoder17,
  getBytesEncoder as getBytesEncoder30,
  getI64Decoder as getI64Decoder7,
  getI64Encoder as getI64Encoder7,
  getStructDecoder as getStructDecoder18,
  getStructEncoder as getStructEncoder18,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS7,
  SolanaError as SolanaError7,
  transformEncoder as transformEncoder16
} from "@solana/kit";
import {
  getAccountMetaFactory as getAccountMetaFactory7,
  getAddressFromResolvedInstructionAccount as getAddressFromResolvedInstructionAccount7
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
  return fixEncoderSize17(getBytesEncoder30(), 8).encode(
    CREATE_AIRDROP_DISCRIMINATOR
  );
}
function getCreateAirdropInstructionDataEncoder() {
  return transformEncoder16(
    getStructEncoder18([
      ["discriminator", fixEncoderSize17(getBytesEncoder30(), 8)],
      ["root", fixEncoderSize17(getBytesEncoder30(), 32)],
      ["startsAt", getI64Encoder7()],
      ["endsAt", getI64Encoder7()]
    ]),
    (value) => ({ ...value, discriminator: CREATE_AIRDROP_DISCRIMINATOR })
  );
}
function getCreateAirdropInstructionDataDecoder() {
  return getStructDecoder18([
    ["discriminator", fixDecoderSize17(getBytesDecoder17(), 8)],
    ["root", fixDecoderSize17(getBytesDecoder17(), 32)],
    ["startsAt", getI64Decoder7()],
    ["endsAt", getI64Decoder7()]
  ]);
}
function getCreateAirdropInstructionDataCodec() {
  return combineCodec18(
    getCreateAirdropInstructionDataEncoder(),
    getCreateAirdropInstructionDataDecoder()
  );
}
async function getCreateAirdropInstructionAsync(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory7(programAddress, "programId");
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
  const getAccountMeta = getAccountMetaFactory7(programAddress, "programId");
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
    throw new SolanaError7(
      SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS7,
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

// clients/generated/instructions/createMarket.ts
import {
  combineCodec as combineCodec19,
  fixDecoderSize as fixDecoderSize18,
  fixEncoderSize as fixEncoderSize18,
  getBytesDecoder as getBytesDecoder18,
  getBytesEncoder as getBytesEncoder31,
  getStructDecoder as getStructDecoder19,
  getStructEncoder as getStructEncoder19,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS8,
  SolanaError as SolanaError8,
  transformEncoder as transformEncoder17
} from "@solana/kit";
import {
  getAccountMetaFactory as getAccountMetaFactory8,
  getAddressFromResolvedInstructionAccount as getAddressFromResolvedInstructionAccount8
} from "@solana/kit/program-client-core";
var CREATE_MARKET_DISCRIMINATOR = new Uint8Array([
  103,
  226,
  97,
  235,
  200,
  188,
  251,
  254
]);
function getCreateMarketDiscriminatorBytes() {
  return fixEncoderSize18(getBytesEncoder31(), 8).encode(
    CREATE_MARKET_DISCRIMINATOR
  );
}
function getCreateMarketInstructionDataEncoder() {
  return transformEncoder17(
    getStructEncoder19([
      ["discriminator", fixEncoderSize18(getBytesEncoder31(), 8)],
      ["risk", getMarketRiskEncoder()]
    ]),
    (value) => ({ ...value, discriminator: CREATE_MARKET_DISCRIMINATOR })
  );
}
function getCreateMarketInstructionDataDecoder() {
  return getStructDecoder19([
    ["discriminator", fixDecoderSize18(getBytesDecoder18(), 8)],
    ["risk", getMarketRiskDecoder()]
  ]);
}
function getCreateMarketInstructionDataCodec() {
  return combineCodec19(
    getCreateMarketInstructionDataEncoder(),
    getCreateMarketInstructionDataDecoder()
  );
}
async function getCreateMarketInstructionAsync(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory8(programAddress, "programId");
  const originalAccounts = {
    admin: { value: input.admin ?? null, isSigner: true, isWritable: true },
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
    market: { value: input.market ?? null, isSigner: false, isWritable: true },
    quoteMint: {
      value: input.quoteMint ?? null,
      isSigner: false,
      isWritable: false
    },
    marketVault: {
      value: input.marketVault ?? null,
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
  const args = { ...input };
  if (!accounts.protocol.value) {
    accounts.protocol.value = await findProtocolPda(
      {
        admin: getAddressFromResolvedInstructionAccount8(
          "admin",
          accounts.admin.value
        )
      },
      { programAddress }
    );
  }
  if (!accounts.market.value) {
    accounts.market.value = await findMarketPda(
      {
        listing: getAddressFromResolvedInstructionAccount8(
          "listing",
          accounts.listing.value
        )
      },
      { programAddress }
    );
  }
  if (!accounts.marketVault.value) {
    accounts.marketVault.value = await findMarketVaultPda(
      {
        market: getAddressFromResolvedInstructionAccount8(
          "market",
          accounts.market.value
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
      getAccountMeta("listing", accounts.listing),
      getAccountMeta("market", accounts.market),
      getAccountMeta("quoteMint", accounts.quoteMint),
      getAccountMeta("marketVault", accounts.marketVault),
      getAccountMeta("quoteProgram", accounts.quoteProgram),
      getAccountMeta("systemProgram", accounts.systemProgram)
    ],
    data: getCreateMarketInstructionDataEncoder().encode(
      args
    ),
    programAddress
  });
}
function getCreateMarketInstruction(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory8(programAddress, "programId");
  const originalAccounts = {
    admin: { value: input.admin ?? null, isSigner: true, isWritable: true },
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
    market: { value: input.market ?? null, isSigner: false, isWritable: true },
    quoteMint: {
      value: input.quoteMint ?? null,
      isSigner: false,
      isWritable: false
    },
    marketVault: {
      value: input.marketVault ?? null,
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
  const args = { ...input };
  if (!accounts.systemProgram.value) {
    accounts.systemProgram.value = "11111111111111111111111111111111";
  }
  return Object.freeze({
    accounts: [
      getAccountMeta("admin", accounts.admin),
      getAccountMeta("protocol", accounts.protocol),
      getAccountMeta("listing", accounts.listing),
      getAccountMeta("market", accounts.market),
      getAccountMeta("quoteMint", accounts.quoteMint),
      getAccountMeta("marketVault", accounts.marketVault),
      getAccountMeta("quoteProgram", accounts.quoteProgram),
      getAccountMeta("systemProgram", accounts.systemProgram)
    ],
    data: getCreateMarketInstructionDataEncoder().encode(
      args
    ),
    programAddress
  });
}
function parseCreateMarketInstruction(instruction) {
  if (instruction.accounts.length < 8) {
    throw new SolanaError8(
      SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS8,
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
      listing: getNextAccount(),
      market: getNextAccount(),
      quoteMint: getNextAccount(),
      marketVault: getNextAccount(),
      quoteProgram: getNextAccount(),
      systemProgram: getNextAccount()
    },
    data: getCreateMarketInstructionDataDecoder().decode(instruction.data)
  };
}

// clients/generated/instructions/deposit.ts
import {
  combineCodec as combineCodec20,
  fixDecoderSize as fixDecoderSize19,
  fixEncoderSize as fixEncoderSize19,
  getBytesDecoder as getBytesDecoder19,
  getBytesEncoder as getBytesEncoder32,
  getStructDecoder as getStructDecoder20,
  getStructEncoder as getStructEncoder20,
  getU64Decoder as getU64Decoder12,
  getU64Encoder as getU64Encoder13,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS9,
  SolanaError as SolanaError9,
  transformEncoder as transformEncoder18
} from "@solana/kit";
import {
  getAccountMetaFactory as getAccountMetaFactory9,
  getAddressFromResolvedInstructionAccount as getAddressFromResolvedInstructionAccount9
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
  return fixEncoderSize19(getBytesEncoder32(), 8).encode(DEPOSIT_DISCRIMINATOR);
}
function getDepositInstructionDataEncoder() {
  return transformEncoder18(
    getStructEncoder20([
      ["discriminator", fixEncoderSize19(getBytesEncoder32(), 8)],
      ["amount", getU64Encoder13()]
    ]),
    (value) => ({ ...value, discriminator: DEPOSIT_DISCRIMINATOR })
  );
}
function getDepositInstructionDataDecoder() {
  return getStructDecoder20([
    ["discriminator", fixDecoderSize19(getBytesDecoder19(), 8)],
    ["amount", getU64Decoder12()]
  ]);
}
function getDepositInstructionDataCodec() {
  return combineCodec20(
    getDepositInstructionDataEncoder(),
    getDepositInstructionDataDecoder()
  );
}
async function getDepositInstructionAsync(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory9(programAddress, "programId");
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
  const getAccountMeta = getAccountMetaFactory9(programAddress, "programId");
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
    throw new SolanaError9(
      SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS9,
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

// clients/generated/instructions/executeBuyback.ts
import {
  addDecoderSizePrefix,
  addEncoderSizePrefix,
  combineCodec as combineCodec21,
  fixDecoderSize as fixDecoderSize20,
  fixEncoderSize as fixEncoderSize20,
  getBytesDecoder as getBytesDecoder20,
  getBytesEncoder as getBytesEncoder33,
  getStructDecoder as getStructDecoder21,
  getStructEncoder as getStructEncoder21,
  getU32Decoder as getU32Decoder2,
  getU32Encoder as getU32Encoder2,
  getU64Decoder as getU64Decoder13,
  getU64Encoder as getU64Encoder14,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS10,
  SolanaError as SolanaError10,
  transformEncoder as transformEncoder19
} from "@solana/kit";
import {
  getAccountMetaFactory as getAccountMetaFactory10,
  getAddressFromResolvedInstructionAccount as getAddressFromResolvedInstructionAccount10
} from "@solana/kit/program-client-core";
var EXECUTE_BUYBACK_DISCRIMINATOR = new Uint8Array(
  [47, 32, 19, 100, 184, 96, 144, 49]
);
function getExecuteBuybackDiscriminatorBytes() {
  return fixEncoderSize20(getBytesEncoder33(), 8).encode(
    EXECUTE_BUYBACK_DISCRIMINATOR
  );
}
function getExecuteBuybackInstructionDataEncoder() {
  return transformEncoder19(
    getStructEncoder21([
      ["discriminator", fixEncoderSize20(getBytesEncoder33(), 8)],
      ["inputAmount", getU64Encoder14()],
      ["minimumOutput", getU64Encoder14()],
      ["swapData", addEncoderSizePrefix(getBytesEncoder33(), getU32Encoder2())]
    ]),
    (value) => ({ ...value, discriminator: EXECUTE_BUYBACK_DISCRIMINATOR })
  );
}
function getExecuteBuybackInstructionDataDecoder() {
  return getStructDecoder21([
    ["discriminator", fixDecoderSize20(getBytesDecoder20(), 8)],
    ["inputAmount", getU64Decoder13()],
    ["minimumOutput", getU64Decoder13()],
    ["swapData", addDecoderSizePrefix(getBytesDecoder20(), getU32Decoder2())]
  ]);
}
function getExecuteBuybackInstructionDataCodec() {
  return combineCodec21(
    getExecuteBuybackInstructionDataEncoder(),
    getExecuteBuybackInstructionDataDecoder()
  );
}
async function getExecuteBuybackInstructionAsync(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory10(programAddress, "programId");
  const originalAccounts = {
    authority: {
      value: input.authority ?? null,
      isSigner: true,
      isWritable: false
    },
    protocol: {
      value: input.protocol ?? null,
      isSigner: false,
      isWritable: false
    },
    revenue: {
      value: input.revenue ?? null,
      isSigner: false,
      isWritable: true
    },
    inputMint: {
      value: input.inputMint ?? null,
      isSigner: false,
      isWritable: false
    },
    inputTokens: {
      value: input.inputTokens ?? null,
      isSigner: false,
      isWritable: true
    },
    leverMint: {
      value: input.leverMint ?? null,
      isSigner: false,
      isWritable: true
    },
    leverTokens: {
      value: input.leverTokens ?? null,
      isSigner: false,
      isWritable: true
    },
    inputProgram: {
      value: input.inputProgram ?? null,
      isSigner: false,
      isWritable: false
    },
    leverProgram: {
      value: input.leverProgram ?? null,
      isSigner: false,
      isWritable: false
    },
    jupiterProgram: {
      value: input.jupiterProgram ?? null,
      isSigner: false,
      isWritable: false
    }
  };
  const accounts = originalAccounts;
  const args = { ...input };
  if (!accounts.revenue.value) {
    accounts.revenue.value = await findRevenuePda(
      {
        protocol: getAddressFromResolvedInstructionAccount10(
          "protocol",
          accounts.protocol.value
        )
      },
      { programAddress }
    );
  }
  if (!accounts.jupiterProgram.value) {
    accounts.jupiterProgram.value = "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4";
  }
  return Object.freeze({
    accounts: [
      getAccountMeta("authority", accounts.authority),
      getAccountMeta("protocol", accounts.protocol),
      getAccountMeta("revenue", accounts.revenue),
      getAccountMeta("inputMint", accounts.inputMint),
      getAccountMeta("inputTokens", accounts.inputTokens),
      getAccountMeta("leverMint", accounts.leverMint),
      getAccountMeta("leverTokens", accounts.leverTokens),
      getAccountMeta("inputProgram", accounts.inputProgram),
      getAccountMeta("leverProgram", accounts.leverProgram),
      getAccountMeta("jupiterProgram", accounts.jupiterProgram)
    ],
    data: getExecuteBuybackInstructionDataEncoder().encode(
      args
    ),
    programAddress
  });
}
function getExecuteBuybackInstruction(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory10(programAddress, "programId");
  const originalAccounts = {
    authority: {
      value: input.authority ?? null,
      isSigner: true,
      isWritable: false
    },
    protocol: {
      value: input.protocol ?? null,
      isSigner: false,
      isWritable: false
    },
    revenue: {
      value: input.revenue ?? null,
      isSigner: false,
      isWritable: true
    },
    inputMint: {
      value: input.inputMint ?? null,
      isSigner: false,
      isWritable: false
    },
    inputTokens: {
      value: input.inputTokens ?? null,
      isSigner: false,
      isWritable: true
    },
    leverMint: {
      value: input.leverMint ?? null,
      isSigner: false,
      isWritable: true
    },
    leverTokens: {
      value: input.leverTokens ?? null,
      isSigner: false,
      isWritable: true
    },
    inputProgram: {
      value: input.inputProgram ?? null,
      isSigner: false,
      isWritable: false
    },
    leverProgram: {
      value: input.leverProgram ?? null,
      isSigner: false,
      isWritable: false
    },
    jupiterProgram: {
      value: input.jupiterProgram ?? null,
      isSigner: false,
      isWritable: false
    }
  };
  const accounts = originalAccounts;
  const args = { ...input };
  if (!accounts.jupiterProgram.value) {
    accounts.jupiterProgram.value = "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4";
  }
  return Object.freeze({
    accounts: [
      getAccountMeta("authority", accounts.authority),
      getAccountMeta("protocol", accounts.protocol),
      getAccountMeta("revenue", accounts.revenue),
      getAccountMeta("inputMint", accounts.inputMint),
      getAccountMeta("inputTokens", accounts.inputTokens),
      getAccountMeta("leverMint", accounts.leverMint),
      getAccountMeta("leverTokens", accounts.leverTokens),
      getAccountMeta("inputProgram", accounts.inputProgram),
      getAccountMeta("leverProgram", accounts.leverProgram),
      getAccountMeta("jupiterProgram", accounts.jupiterProgram)
    ],
    data: getExecuteBuybackInstructionDataEncoder().encode(
      args
    ),
    programAddress
  });
}
function parseExecuteBuybackInstruction(instruction) {
  if (instruction.accounts.length < 10) {
    throw new SolanaError10(
      SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS10,
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
      authority: getNextAccount(),
      protocol: getNextAccount(),
      revenue: getNextAccount(),
      inputMint: getNextAccount(),
      inputTokens: getNextAccount(),
      leverMint: getNextAccount(),
      leverTokens: getNextAccount(),
      inputProgram: getNextAccount(),
      leverProgram: getNextAccount(),
      jupiterProgram: getNextAccount()
    },
    data: getExecuteBuybackInstructionDataDecoder().decode(instruction.data)
  };
}

// clients/generated/instructions/fundMarket.ts
import {
  combineCodec as combineCodec22,
  fixDecoderSize as fixDecoderSize21,
  fixEncoderSize as fixEncoderSize21,
  getBytesDecoder as getBytesDecoder21,
  getBytesEncoder as getBytesEncoder34,
  getStructDecoder as getStructDecoder22,
  getStructEncoder as getStructEncoder22,
  getU64Decoder as getU64Decoder14,
  getU64Encoder as getU64Encoder15,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS11,
  SolanaError as SolanaError11,
  transformEncoder as transformEncoder20
} from "@solana/kit";
import {
  getAccountMetaFactory as getAccountMetaFactory11,
  getAddressFromResolvedInstructionAccount as getAddressFromResolvedInstructionAccount11
} from "@solana/kit/program-client-core";
var FUND_MARKET_DISCRIMINATOR = new Uint8Array([
  173,
  177,
  32,
  57,
  20,
  248,
  119,
  160
]);
function getFundMarketDiscriminatorBytes() {
  return fixEncoderSize21(getBytesEncoder34(), 8).encode(FUND_MARKET_DISCRIMINATOR);
}
function getFundMarketInstructionDataEncoder() {
  return transformEncoder20(
    getStructEncoder22([
      ["discriminator", fixEncoderSize21(getBytesEncoder34(), 8)],
      ["amount", getU64Encoder15()]
    ]),
    (value) => ({ ...value, discriminator: FUND_MARKET_DISCRIMINATOR })
  );
}
function getFundMarketInstructionDataDecoder() {
  return getStructDecoder22([
    ["discriminator", fixDecoderSize21(getBytesDecoder21(), 8)],
    ["amount", getU64Decoder14()]
  ]);
}
function getFundMarketInstructionDataCodec() {
  return combineCodec22(
    getFundMarketInstructionDataEncoder(),
    getFundMarketInstructionDataDecoder()
  );
}
async function getFundMarketInstructionAsync(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory11(programAddress, "programId");
  const originalAccounts = {
    lister: { value: input.lister ?? null, isSigner: true, isWritable: false },
    protocol: {
      value: input.protocol ?? null,
      isSigner: false,
      isWritable: false
    },
    market: { value: input.market ?? null, isSigner: false, isWritable: true },
    quoteMint: {
      value: input.quoteMint ?? null,
      isSigner: false,
      isWritable: false
    },
    marketVault: {
      value: input.marketVault ?? null,
      isSigner: false,
      isWritable: true
    },
    listerTokens: {
      value: input.listerTokens ?? null,
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
  if (!accounts.marketVault.value) {
    accounts.marketVault.value = await findMarketVaultPda(
      {
        market: getAddressFromResolvedInstructionAccount11(
          "market",
          accounts.market.value
        )
      },
      { programAddress }
    );
  }
  return Object.freeze({
    accounts: [
      getAccountMeta("lister", accounts.lister),
      getAccountMeta("protocol", accounts.protocol),
      getAccountMeta("market", accounts.market),
      getAccountMeta("quoteMint", accounts.quoteMint),
      getAccountMeta("marketVault", accounts.marketVault),
      getAccountMeta("listerTokens", accounts.listerTokens),
      getAccountMeta("quoteProgram", accounts.quoteProgram)
    ],
    data: getFundMarketInstructionDataEncoder().encode(
      args
    ),
    programAddress
  });
}
function getFundMarketInstruction(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory11(programAddress, "programId");
  const originalAccounts = {
    lister: { value: input.lister ?? null, isSigner: true, isWritable: false },
    protocol: {
      value: input.protocol ?? null,
      isSigner: false,
      isWritable: false
    },
    market: { value: input.market ?? null, isSigner: false, isWritable: true },
    quoteMint: {
      value: input.quoteMint ?? null,
      isSigner: false,
      isWritable: false
    },
    marketVault: {
      value: input.marketVault ?? null,
      isSigner: false,
      isWritable: true
    },
    listerTokens: {
      value: input.listerTokens ?? null,
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
      getAccountMeta("lister", accounts.lister),
      getAccountMeta("protocol", accounts.protocol),
      getAccountMeta("market", accounts.market),
      getAccountMeta("quoteMint", accounts.quoteMint),
      getAccountMeta("marketVault", accounts.marketVault),
      getAccountMeta("listerTokens", accounts.listerTokens),
      getAccountMeta("quoteProgram", accounts.quoteProgram)
    ],
    data: getFundMarketInstructionDataEncoder().encode(
      args
    ),
    programAddress
  });
}
function parseFundMarketInstruction(instruction) {
  if (instruction.accounts.length < 7) {
    throw new SolanaError11(
      SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS11,
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
      market: getNextAccount(),
      quoteMint: getNextAccount(),
      marketVault: getNextAccount(),
      listerTokens: getNextAccount(),
      quoteProgram: getNextAccount()
    },
    data: getFundMarketInstructionDataDecoder().decode(instruction.data)
  };
}

// clients/generated/instructions/initializeProtocol.ts
import {
  combineCodec as combineCodec23,
  fixDecoderSize as fixDecoderSize22,
  fixEncoderSize as fixEncoderSize22,
  getAddressEncoder as getAddressEncoder26,
  getBytesDecoder as getBytesDecoder22,
  getBytesEncoder as getBytesEncoder35,
  getProgramDerivedAddress as getProgramDerivedAddress15,
  getStructDecoder as getStructDecoder23,
  getStructEncoder as getStructEncoder23,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS12,
  SolanaError as SolanaError12,
  transformEncoder as transformEncoder21
} from "@solana/kit";
import {
  getAccountMetaFactory as getAccountMetaFactory12,
  getAddressFromResolvedInstructionAccount as getAddressFromResolvedInstructionAccount12
} from "@solana/kit/program-client-core";
var INITIALIZE_PROTOCOL_DISCRIMINATOR = new Uint8Array([188, 233, 252, 106, 134, 146, 202, 91]);
function getInitializeProtocolDiscriminatorBytes() {
  return fixEncoderSize22(getBytesEncoder35(), 8).encode(
    INITIALIZE_PROTOCOL_DISCRIMINATOR
  );
}
function getInitializeProtocolInstructionDataEncoder() {
  return transformEncoder21(
    getStructEncoder23([
      ["discriminator", fixEncoderSize22(getBytesEncoder35(), 8)],
      ["policy", getListingPolicyEncoder()]
    ]),
    (value) => ({ ...value, discriminator: INITIALIZE_PROTOCOL_DISCRIMINATOR })
  );
}
function getInitializeProtocolInstructionDataDecoder() {
  return getStructDecoder23([
    ["discriminator", fixDecoderSize22(getBytesDecoder22(), 8)],
    ["policy", getListingPolicyDecoder()]
  ]);
}
function getInitializeProtocolInstructionDataCodec() {
  return combineCodec23(
    getInitializeProtocolInstructionDataEncoder(),
    getInitializeProtocolInstructionDataDecoder()
  );
}
async function getInitializeProtocolInstructionAsync(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory12(programAddress, "programId");
  const originalAccounts = {
    admin: { value: input.admin ?? null, isSigner: true, isWritable: true },
    protocol: {
      value: input.protocol ?? null,
      isSigner: false,
      isWritable: true
    },
    revenue: {
      value: input.revenue ?? null,
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
    leverCurve: {
      value: input.leverCurve ?? null,
      isSigner: false,
      isWritable: false
    },
    quoteCurve: {
      value: input.quoteCurve ?? null,
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
        admin: getAddressFromResolvedInstructionAccount12(
          "admin",
          accounts.admin.value
        )
      },
      { programAddress }
    );
  }
  if (!accounts.revenue.value) {
    accounts.revenue.value = await findRevenuePda(
      {
        protocol: getAddressFromResolvedInstructionAccount12(
          "protocol",
          accounts.protocol.value
        )
      },
      { programAddress }
    );
  }
  if (!accounts.leverCurve.value) {
    accounts.leverCurve.value = await getProgramDerivedAddress15({
      programAddress: "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P",
      seeds: [
        getBytesEncoder35().encode(
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
        getAddressEncoder26().encode(
          getAddressFromResolvedInstructionAccount12(
            "leverMint",
            accounts.leverMint.value
          )
        )
      ]
    });
  }
  if (!accounts.quoteCurve.value) {
    accounts.quoteCurve.value = await getProgramDerivedAddress15({
      programAddress: "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P",
      seeds: [
        getBytesEncoder35().encode(
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
        getAddressEncoder26().encode(
          getAddressFromResolvedInstructionAccount12(
            "quoteMint",
            accounts.quoteMint.value
          )
        )
      ]
    });
  }
  if (!accounts.systemProgram.value) {
    accounts.systemProgram.value = "11111111111111111111111111111111";
  }
  return Object.freeze({
    accounts: [
      getAccountMeta("admin", accounts.admin),
      getAccountMeta("protocol", accounts.protocol),
      getAccountMeta("revenue", accounts.revenue),
      getAccountMeta("leverMint", accounts.leverMint),
      getAccountMeta("quoteMint", accounts.quoteMint),
      getAccountMeta("leverCurve", accounts.leverCurve),
      getAccountMeta("quoteCurve", accounts.quoteCurve),
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
  const getAccountMeta = getAccountMetaFactory12(programAddress, "programId");
  const originalAccounts = {
    admin: { value: input.admin ?? null, isSigner: true, isWritable: true },
    protocol: {
      value: input.protocol ?? null,
      isSigner: false,
      isWritable: true
    },
    revenue: {
      value: input.revenue ?? null,
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
    leverCurve: {
      value: input.leverCurve ?? null,
      isSigner: false,
      isWritable: false
    },
    quoteCurve: {
      value: input.quoteCurve ?? null,
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
      getAccountMeta("revenue", accounts.revenue),
      getAccountMeta("leverMint", accounts.leverMint),
      getAccountMeta("quoteMint", accounts.quoteMint),
      getAccountMeta("leverCurve", accounts.leverCurve),
      getAccountMeta("quoteCurve", accounts.quoteCurve),
      getAccountMeta("systemProgram", accounts.systemProgram)
    ],
    data: getInitializeProtocolInstructionDataEncoder().encode(
      args
    ),
    programAddress
  });
}
function parseInitializeProtocolInstruction(instruction) {
  if (instruction.accounts.length < 8) {
    throw new SolanaError12(
      SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS12,
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
      revenue: getNextAccount(),
      leverMint: getNextAccount(),
      quoteMint: getNextAccount(),
      leverCurve: getNextAccount(),
      quoteCurve: getNextAccount(),
      systemProgram: getNextAccount()
    },
    data: getInitializeProtocolInstructionDataDecoder().decode(
      instruction.data
    )
  };
}

// clients/generated/instructions/openMarginAccount.ts
import {
  combineCodec as combineCodec24,
  fixDecoderSize as fixDecoderSize23,
  fixEncoderSize as fixEncoderSize23,
  getBytesDecoder as getBytesDecoder23,
  getBytesEncoder as getBytesEncoder36,
  getStructDecoder as getStructDecoder24,
  getStructEncoder as getStructEncoder24,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS13,
  SolanaError as SolanaError13,
  transformEncoder as transformEncoder22
} from "@solana/kit";
import {
  getAccountMetaFactory as getAccountMetaFactory13,
  getAddressFromResolvedInstructionAccount as getAddressFromResolvedInstructionAccount13
} from "@solana/kit/program-client-core";
var OPEN_MARGIN_ACCOUNT_DISCRIMINATOR = new Uint8Array([251, 54, 54, 233, 180, 125, 203, 107]);
function getOpenMarginAccountDiscriminatorBytes() {
  return fixEncoderSize23(getBytesEncoder36(), 8).encode(
    OPEN_MARGIN_ACCOUNT_DISCRIMINATOR
  );
}
function getOpenMarginAccountInstructionDataEncoder() {
  return transformEncoder22(
    getStructEncoder24([["discriminator", fixEncoderSize23(getBytesEncoder36(), 8)]]),
    (value) => ({ ...value, discriminator: OPEN_MARGIN_ACCOUNT_DISCRIMINATOR })
  );
}
function getOpenMarginAccountInstructionDataDecoder() {
  return getStructDecoder24([
    ["discriminator", fixDecoderSize23(getBytesDecoder23(), 8)]
  ]);
}
function getOpenMarginAccountInstructionDataCodec() {
  return combineCodec24(
    getOpenMarginAccountInstructionDataEncoder(),
    getOpenMarginAccountInstructionDataDecoder()
  );
}
async function getOpenMarginAccountInstructionAsync(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory13(programAddress, "programId");
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
        protocol: getAddressFromResolvedInstructionAccount13(
          "protocol",
          accounts.protocol.value
        ),
        owner: getAddressFromResolvedInstructionAccount13(
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
        margin: getAddressFromResolvedInstructionAccount13(
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
  const getAccountMeta = getAccountMetaFactory13(programAddress, "programId");
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
      quoteMint: getNextAccount(),
      margin: getNextAccount(),
      quoteVault: getNextAccount(),
      quoteProgram: getNextAccount(),
      systemProgram: getNextAccount()
    },
    data: getOpenMarginAccountInstructionDataDecoder().decode(instruction.data)
  };
}

// clients/generated/instructions/openPosition.ts
import {
  combineCodec as combineCodec25,
  fixDecoderSize as fixDecoderSize24,
  fixEncoderSize as fixEncoderSize24,
  getBooleanDecoder as getBooleanDecoder7,
  getBooleanEncoder as getBooleanEncoder7,
  getBytesDecoder as getBytesDecoder24,
  getBytesEncoder as getBytesEncoder37,
  getStructDecoder as getStructDecoder25,
  getStructEncoder as getStructEncoder25,
  getU16Decoder as getU16Decoder3,
  getU16Encoder as getU16Encoder3,
  getU64Decoder as getU64Decoder15,
  getU64Encoder as getU64Encoder16,
  getU8Decoder as getU8Decoder10,
  getU8Encoder as getU8Encoder10,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS14,
  SolanaError as SolanaError14,
  transformEncoder as transformEncoder23
} from "@solana/kit";
import {
  getAccountMetaFactory as getAccountMetaFactory14,
  getAddressFromResolvedInstructionAccount as getAddressFromResolvedInstructionAccount14,
  getNonNullResolvedInstructionInput
} from "@solana/kit/program-client-core";
var OPEN_POSITION_DISCRIMINATOR = new Uint8Array([
  135,
  128,
  47,
  77,
  15,
  152,
  240,
  49
]);
function getOpenPositionDiscriminatorBytes() {
  return fixEncoderSize24(getBytesEncoder37(), 8).encode(
    OPEN_POSITION_DISCRIMINATOR
  );
}
function getOpenPositionInstructionDataEncoder() {
  return transformEncoder23(
    getStructEncoder25([
      ["discriminator", fixEncoderSize24(getBytesEncoder37(), 8)],
      ["id", getU64Encoder16()],
      ["collateral", getU64Encoder16()],
      ["leverage", getU8Encoder10()],
      ["long", getBooleanEncoder7()],
      ["expectedPrice", getU64Encoder16()],
      ["slippageBps", getU16Encoder3()]
    ]),
    (value) => ({ ...value, discriminator: OPEN_POSITION_DISCRIMINATOR })
  );
}
function getOpenPositionInstructionDataDecoder() {
  return getStructDecoder25([
    ["discriminator", fixDecoderSize24(getBytesDecoder24(), 8)],
    ["id", getU64Decoder15()],
    ["collateral", getU64Decoder15()],
    ["leverage", getU8Decoder10()],
    ["long", getBooleanDecoder7()],
    ["expectedPrice", getU64Decoder15()],
    ["slippageBps", getU16Decoder3()]
  ]);
}
function getOpenPositionInstructionDataCodec() {
  return combineCodec25(
    getOpenPositionInstructionDataEncoder(),
    getOpenPositionInstructionDataDecoder()
  );
}
async function getOpenPositionInstructionAsync(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory14(programAddress, "programId");
  const originalAccounts = {
    owner: { value: input.owner ?? null, isSigner: true, isWritable: true },
    protocol: {
      value: input.protocol ?? null,
      isSigner: false,
      isWritable: false
    },
    listing: {
      value: input.listing ?? null,
      isSigner: false,
      isWritable: false
    },
    market: { value: input.market ?? null, isSigner: false, isWritable: true },
    margin: { value: input.margin ?? null, isSigner: false, isWritable: true },
    position: {
      value: input.position ?? null,
      isSigner: false,
      isWritable: true
    },
    quoteMint: {
      value: input.quoteMint ?? null,
      isSigner: false,
      isWritable: false
    },
    userVault: {
      value: input.userVault ?? null,
      isSigner: false,
      isWritable: true
    },
    marketVault: {
      value: input.marketVault ?? null,
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
  const args = { ...input };
  if (!accounts.market.value) {
    accounts.market.value = await findMarketPda(
      {
        listing: getAddressFromResolvedInstructionAccount14(
          "listing",
          accounts.listing.value
        )
      },
      { programAddress }
    );
  }
  if (!accounts.margin.value) {
    accounts.margin.value = await findMarginPda(
      {
        protocol: getAddressFromResolvedInstructionAccount14(
          "protocol",
          accounts.protocol.value
        ),
        owner: getAddressFromResolvedInstructionAccount14(
          "owner",
          accounts.owner.value
        )
      },
      { programAddress }
    );
  }
  if (!accounts.position.value) {
    accounts.position.value = await findPositionPda(
      {
        margin: getAddressFromResolvedInstructionAccount14(
          "margin",
          accounts.margin.value
        ),
        id: getNonNullResolvedInstructionInput("id", args.id)
      },
      { programAddress }
    );
  }
  if (!accounts.userVault.value) {
    accounts.userVault.value = await findQuoteVaultPda(
      {
        margin: getAddressFromResolvedInstructionAccount14(
          "margin",
          accounts.margin.value
        )
      },
      { programAddress }
    );
  }
  if (!accounts.marketVault.value) {
    accounts.marketVault.value = await findMarketVaultPda(
      {
        market: getAddressFromResolvedInstructionAccount14(
          "market",
          accounts.market.value
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
      getAccountMeta("listing", accounts.listing),
      getAccountMeta("market", accounts.market),
      getAccountMeta("margin", accounts.margin),
      getAccountMeta("position", accounts.position),
      getAccountMeta("quoteMint", accounts.quoteMint),
      getAccountMeta("userVault", accounts.userVault),
      getAccountMeta("marketVault", accounts.marketVault),
      getAccountMeta("quoteProgram", accounts.quoteProgram),
      getAccountMeta("systemProgram", accounts.systemProgram)
    ],
    data: getOpenPositionInstructionDataEncoder().encode(
      args
    ),
    programAddress
  });
}
function getOpenPositionInstruction(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory14(programAddress, "programId");
  const originalAccounts = {
    owner: { value: input.owner ?? null, isSigner: true, isWritable: true },
    protocol: {
      value: input.protocol ?? null,
      isSigner: false,
      isWritable: false
    },
    listing: {
      value: input.listing ?? null,
      isSigner: false,
      isWritable: false
    },
    market: { value: input.market ?? null, isSigner: false, isWritable: true },
    margin: { value: input.margin ?? null, isSigner: false, isWritable: true },
    position: {
      value: input.position ?? null,
      isSigner: false,
      isWritable: true
    },
    quoteMint: {
      value: input.quoteMint ?? null,
      isSigner: false,
      isWritable: false
    },
    userVault: {
      value: input.userVault ?? null,
      isSigner: false,
      isWritable: true
    },
    marketVault: {
      value: input.marketVault ?? null,
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
  const args = { ...input };
  if (!accounts.systemProgram.value) {
    accounts.systemProgram.value = "11111111111111111111111111111111";
  }
  return Object.freeze({
    accounts: [
      getAccountMeta("owner", accounts.owner),
      getAccountMeta("protocol", accounts.protocol),
      getAccountMeta("listing", accounts.listing),
      getAccountMeta("market", accounts.market),
      getAccountMeta("margin", accounts.margin),
      getAccountMeta("position", accounts.position),
      getAccountMeta("quoteMint", accounts.quoteMint),
      getAccountMeta("userVault", accounts.userVault),
      getAccountMeta("marketVault", accounts.marketVault),
      getAccountMeta("quoteProgram", accounts.quoteProgram),
      getAccountMeta("systemProgram", accounts.systemProgram)
    ],
    data: getOpenPositionInstructionDataEncoder().encode(
      args
    ),
    programAddress
  });
}
function parseOpenPositionInstruction(instruction) {
  if (instruction.accounts.length < 11) {
    throw new SolanaError14(
      SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS14,
      {
        actualAccountMetas: instruction.accounts.length,
        expectedAccountMetas: 11
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
      listing: getNextAccount(),
      market: getNextAccount(),
      margin: getNextAccount(),
      position: getNextAccount(),
      quoteMint: getNextAccount(),
      userVault: getNextAccount(),
      marketVault: getNextAccount(),
      quoteProgram: getNextAccount(),
      systemProgram: getNextAccount()
    },
    data: getOpenPositionInstructionDataDecoder().decode(instruction.data)
  };
}

// clients/generated/instructions/reclaimAirdrop.ts
import {
  combineCodec as combineCodec26,
  fixDecoderSize as fixDecoderSize25,
  fixEncoderSize as fixEncoderSize25,
  getBytesDecoder as getBytesDecoder25,
  getBytesEncoder as getBytesEncoder38,
  getStructDecoder as getStructDecoder26,
  getStructEncoder as getStructEncoder26,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS15,
  SolanaError as SolanaError15,
  transformEncoder as transformEncoder24
} from "@solana/kit";
import {
  getAccountMetaFactory as getAccountMetaFactory15,
  getAddressFromResolvedInstructionAccount as getAddressFromResolvedInstructionAccount15
} from "@solana/kit/program-client-core";
var RECLAIM_AIRDROP_DISCRIMINATOR = new Uint8Array(
  [91, 136, 224, 68, 150, 221, 18, 207]
);
function getReclaimAirdropDiscriminatorBytes() {
  return fixEncoderSize25(getBytesEncoder38(), 8).encode(
    RECLAIM_AIRDROP_DISCRIMINATOR
  );
}
function getReclaimAirdropInstructionDataEncoder() {
  return transformEncoder24(
    getStructEncoder26([["discriminator", fixEncoderSize25(getBytesEncoder38(), 8)]]),
    (value) => ({ ...value, discriminator: RECLAIM_AIRDROP_DISCRIMINATOR })
  );
}
function getReclaimAirdropInstructionDataDecoder() {
  return getStructDecoder26([
    ["discriminator", fixDecoderSize25(getBytesDecoder25(), 8)]
  ]);
}
function getReclaimAirdropInstructionDataCodec() {
  return combineCodec26(
    getReclaimAirdropInstructionDataEncoder(),
    getReclaimAirdropInstructionDataDecoder()
  );
}
async function getReclaimAirdropInstructionAsync(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory15(programAddress, "programId");
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
        protocol: getAddressFromResolvedInstructionAccount15(
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
        campaign: getAddressFromResolvedInstructionAccount15(
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
  const getAccountMeta = getAccountMetaFactory15(programAddress, "programId");
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
    throw new SolanaError15(
      SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS15,
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

// clients/generated/instructions/refreshMarketPrice.ts
import {
  combineCodec as combineCodec27,
  fixDecoderSize as fixDecoderSize26,
  fixEncoderSize as fixEncoderSize26,
  getBytesDecoder as getBytesDecoder26,
  getBytesEncoder as getBytesEncoder39,
  getStructDecoder as getStructDecoder27,
  getStructEncoder as getStructEncoder27,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS16,
  SolanaError as SolanaError16,
  transformEncoder as transformEncoder25
} from "@solana/kit";
import {
  getAccountMetaFactory as getAccountMetaFactory16
} from "@solana/kit/program-client-core";
var REFRESH_MARKET_PRICE_DISCRIMINATOR = new Uint8Array([66, 92, 186, 127, 188, 0, 23, 207]);
function getRefreshMarketPriceDiscriminatorBytes() {
  return fixEncoderSize26(getBytesEncoder39(), 8).encode(
    REFRESH_MARKET_PRICE_DISCRIMINATOR
  );
}
function getRefreshMarketPriceInstructionDataEncoder() {
  return transformEncoder25(
    getStructEncoder27([["discriminator", fixEncoderSize26(getBytesEncoder39(), 8)]]),
    (value) => ({
      ...value,
      discriminator: REFRESH_MARKET_PRICE_DISCRIMINATOR
    })
  );
}
function getRefreshMarketPriceInstructionDataDecoder() {
  return getStructDecoder27([
    ["discriminator", fixDecoderSize26(getBytesDecoder26(), 8)]
  ]);
}
function getRefreshMarketPriceInstructionDataCodec() {
  return combineCodec27(
    getRefreshMarketPriceInstructionDataEncoder(),
    getRefreshMarketPriceInstructionDataDecoder()
  );
}
function getRefreshMarketPriceInstruction(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory16(programAddress, "programId");
  const originalAccounts = {
    protocol: {
      value: input.protocol ?? null,
      isSigner: false,
      isWritable: false
    },
    market: { value: input.market ?? null, isSigner: false, isWritable: true },
    queue: { value: input.queue ?? null, isSigner: false, isWritable: false },
    oracle: { value: input.oracle ?? null, isSigner: false, isWritable: false },
    slotHashes: {
      value: input.slotHashes ?? null,
      isSigner: false,
      isWritable: false
    },
    instructions: {
      value: input.instructions ?? null,
      isSigner: false,
      isWritable: false
    }
  };
  const accounts = originalAccounts;
  return Object.freeze({
    accounts: [
      getAccountMeta("protocol", accounts.protocol),
      getAccountMeta("market", accounts.market),
      getAccountMeta("queue", accounts.queue),
      getAccountMeta("oracle", accounts.oracle),
      getAccountMeta("slotHashes", accounts.slotHashes),
      getAccountMeta("instructions", accounts.instructions)
    ],
    data: getRefreshMarketPriceInstructionDataEncoder().encode({}),
    programAddress
  });
}
function parseRefreshMarketPriceInstruction(instruction) {
  if (instruction.accounts.length < 6) {
    throw new SolanaError16(
      SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS16,
      {
        actualAccountMetas: instruction.accounts.length,
        expectedAccountMetas: 6
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
      protocol: getNextAccount(),
      market: getNextAccount(),
      queue: getNextAccount(),
      oracle: getNextAccount(),
      slotHashes: getNextAccount(),
      instructions: getNextAccount()
    },
    data: getRefreshMarketPriceInstructionDataDecoder().decode(
      instruction.data
    )
  };
}

// clients/generated/instructions/requestListing.ts
import {
  combineCodec as combineCodec28,
  fixDecoderSize as fixDecoderSize27,
  fixEncoderSize as fixEncoderSize27,
  getAddressEncoder as getAddressEncoder27,
  getBytesDecoder as getBytesDecoder27,
  getBytesEncoder as getBytesEncoder40,
  getProgramDerivedAddress as getProgramDerivedAddress16,
  getStructDecoder as getStructDecoder28,
  getStructEncoder as getStructEncoder28,
  getU64Decoder as getU64Decoder16,
  getU64Encoder as getU64Encoder17,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS17,
  SolanaError as SolanaError17,
  transformEncoder as transformEncoder26
} from "@solana/kit";
import {
  getAccountMetaFactory as getAccountMetaFactory17,
  getAddressFromResolvedInstructionAccount as getAddressFromResolvedInstructionAccount16
} from "@solana/kit/program-client-core";
var REQUEST_LISTING_DISCRIMINATOR = new Uint8Array(
  [2, 167, 98, 66, 122, 255, 254, 216]
);
function getRequestListingDiscriminatorBytes() {
  return fixEncoderSize27(getBytesEncoder40(), 8).encode(
    REQUEST_LISTING_DISCRIMINATOR
  );
}
function getRequestListingInstructionDataEncoder() {
  return transformEncoder26(
    getStructEncoder28([
      ["discriminator", fixEncoderSize27(getBytesEncoder40(), 8)],
      ["solLamports", getU64Encoder17()],
      ["tokenAmount", getU64Encoder17()]
    ]),
    (value) => ({ ...value, discriminator: REQUEST_LISTING_DISCRIMINATOR })
  );
}
function getRequestListingInstructionDataDecoder() {
  return getStructDecoder28([
    ["discriminator", fixDecoderSize27(getBytesDecoder27(), 8)],
    ["solLamports", getU64Decoder16()],
    ["tokenAmount", getU64Decoder16()]
  ]);
}
function getRequestListingInstructionDataCodec() {
  return combineCodec28(
    getRequestListingInstructionDataEncoder(),
    getRequestListingInstructionDataDecoder()
  );
}
async function getRequestListingInstructionAsync(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory17(programAddress, "programId");
  const originalAccounts = {
    lister: { value: input.lister ?? null, isSigner: true, isWritable: true },
    protocol: {
      value: input.protocol ?? null,
      isSigner: false,
      isWritable: true
    },
    permit: { value: input.permit ?? null, isSigner: false, isWritable: true },
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
  if (!accounts.permit.value) {
    accounts.permit.value = await findPermitPda(
      {
        protocol: getAddressFromResolvedInstructionAccount16(
          "protocol",
          accounts.protocol.value
        ),
        baseMint: getAddressFromResolvedInstructionAccount16(
          "baseMint",
          accounts.baseMint.value
        ),
        lister: getAddressFromResolvedInstructionAccount16(
          "lister",
          accounts.lister.value
        )
      },
      { programAddress }
    );
  }
  if (!accounts.listing.value) {
    accounts.listing.value = await findListingPda(
      {
        protocol: getAddressFromResolvedInstructionAccount16(
          "protocol",
          accounts.protocol.value
        ),
        baseMint: getAddressFromResolvedInstructionAccount16(
          "baseMint",
          accounts.baseMint.value
        )
      },
      { programAddress }
    );
  }
  if (!accounts.pumpCurve.value) {
    accounts.pumpCurve.value = await getProgramDerivedAddress16({
      programAddress: "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P",
      seeds: [
        getBytesEncoder40().encode(
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
        getAddressEncoder27().encode(
          getAddressFromResolvedInstructionAccount16(
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
        listing: getAddressFromResolvedInstructionAccount16(
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
      getAccountMeta("permit", accounts.permit),
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
  const getAccountMeta = getAccountMetaFactory17(programAddress, "programId");
  const originalAccounts = {
    lister: { value: input.lister ?? null, isSigner: true, isWritable: true },
    protocol: {
      value: input.protocol ?? null,
      isSigner: false,
      isWritable: true
    },
    permit: { value: input.permit ?? null, isSigner: false, isWritable: true },
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
      getAccountMeta("permit", accounts.permit),
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
    throw new SolanaError17(
      SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS17,
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
      permit: getNextAccount(),
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

// clients/generated/instructions/retireMarket.ts
import {
  combineCodec as combineCodec29,
  fixDecoderSize as fixDecoderSize28,
  fixEncoderSize as fixEncoderSize28,
  getBytesDecoder as getBytesDecoder28,
  getBytesEncoder as getBytesEncoder41,
  getStructDecoder as getStructDecoder29,
  getStructEncoder as getStructEncoder29,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS18,
  SolanaError as SolanaError18,
  transformEncoder as transformEncoder27
} from "@solana/kit";
import {
  getAccountMetaFactory as getAccountMetaFactory18,
  getAddressFromResolvedInstructionAccount as getAddressFromResolvedInstructionAccount17
} from "@solana/kit/program-client-core";
var RETIRE_MARKET_DISCRIMINATOR = new Uint8Array([
  68,
  198,
  103,
  192,
  149,
  141,
  34,
  156
]);
function getRetireMarketDiscriminatorBytes() {
  return fixEncoderSize28(getBytesEncoder41(), 8).encode(
    RETIRE_MARKET_DISCRIMINATOR
  );
}
function getRetireMarketInstructionDataEncoder() {
  return transformEncoder27(
    getStructEncoder29([["discriminator", fixEncoderSize28(getBytesEncoder41(), 8)]]),
    (value) => ({ ...value, discriminator: RETIRE_MARKET_DISCRIMINATOR })
  );
}
function getRetireMarketInstructionDataDecoder() {
  return getStructDecoder29([
    ["discriminator", fixDecoderSize28(getBytesDecoder28(), 8)]
  ]);
}
function getRetireMarketInstructionDataCodec() {
  return combineCodec29(
    getRetireMarketInstructionDataEncoder(),
    getRetireMarketInstructionDataDecoder()
  );
}
async function getRetireMarketInstructionAsync(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory18(programAddress, "programId");
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
    },
    market: { value: input.market ?? null, isSigner: false, isWritable: true }
  };
  const accounts = originalAccounts;
  if (!accounts.protocol.value) {
    accounts.protocol.value = await findProtocolPda(
      {
        admin: getAddressFromResolvedInstructionAccount17(
          "admin",
          accounts.admin.value
        )
      },
      { programAddress }
    );
  }
  if (!accounts.market.value) {
    accounts.market.value = await findMarketPda(
      {
        listing: getAddressFromResolvedInstructionAccount17(
          "listing",
          accounts.listing.value
        )
      },
      { programAddress }
    );
  }
  return Object.freeze({
    accounts: [
      getAccountMeta("admin", accounts.admin),
      getAccountMeta("protocol", accounts.protocol),
      getAccountMeta("listing", accounts.listing),
      getAccountMeta("market", accounts.market)
    ],
    data: getRetireMarketInstructionDataEncoder().encode({}),
    programAddress
  });
}
function getRetireMarketInstruction(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory18(programAddress, "programId");
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
    },
    market: { value: input.market ?? null, isSigner: false, isWritable: true }
  };
  const accounts = originalAccounts;
  return Object.freeze({
    accounts: [
      getAccountMeta("admin", accounts.admin),
      getAccountMeta("protocol", accounts.protocol),
      getAccountMeta("listing", accounts.listing),
      getAccountMeta("market", accounts.market)
    ],
    data: getRetireMarketInstructionDataEncoder().encode({}),
    programAddress
  });
}
function parseRetireMarketInstruction(instruction) {
  if (instruction.accounts.length < 4) {
    throw new SolanaError18(
      SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS18,
      {
        actualAccountMetas: instruction.accounts.length,
        expectedAccountMetas: 4
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
      market: getNextAccount()
    },
    data: getRetireMarketInstructionDataDecoder().decode(instruction.data)
  };
}

// clients/generated/instructions/routePlatformRevenue.ts
import {
  combineCodec as combineCodec30,
  fixDecoderSize as fixDecoderSize29,
  fixEncoderSize as fixEncoderSize29,
  getBytesDecoder as getBytesDecoder29,
  getBytesEncoder as getBytesEncoder42,
  getStructDecoder as getStructDecoder30,
  getStructEncoder as getStructEncoder30,
  getU64Decoder as getU64Decoder17,
  getU64Encoder as getU64Encoder18,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS19,
  SolanaError as SolanaError19,
  transformEncoder as transformEncoder28
} from "@solana/kit";
import {
  getAccountMetaFactory as getAccountMetaFactory19
} from "@solana/kit/program-client-core";
var ROUTE_PLATFORM_REVENUE_DISCRIMINATOR = new Uint8Array([72, 200, 22, 148, 177, 183, 136, 29]);
function getRoutePlatformRevenueDiscriminatorBytes() {
  return fixEncoderSize29(getBytesEncoder42(), 8).encode(
    ROUTE_PLATFORM_REVENUE_DISCRIMINATOR
  );
}
function getRoutePlatformRevenueInstructionDataEncoder() {
  return transformEncoder28(
    getStructEncoder30([
      ["discriminator", fixEncoderSize29(getBytesEncoder42(), 8)],
      ["amount", getU64Encoder18()]
    ]),
    (value) => ({
      ...value,
      discriminator: ROUTE_PLATFORM_REVENUE_DISCRIMINATOR
    })
  );
}
function getRoutePlatformRevenueInstructionDataDecoder() {
  return getStructDecoder30([
    ["discriminator", fixDecoderSize29(getBytesDecoder29(), 8)],
    ["amount", getU64Decoder17()]
  ]);
}
function getRoutePlatformRevenueInstructionDataCodec() {
  return combineCodec30(
    getRoutePlatformRevenueInstructionDataEncoder(),
    getRoutePlatformRevenueInstructionDataDecoder()
  );
}
function getRoutePlatformRevenueInstruction(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory19(programAddress, "programId");
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
    throw new SolanaError19(
      SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS19,
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
  combineCodec as combineCodec31,
  fixDecoderSize as fixDecoderSize30,
  fixEncoderSize as fixEncoderSize30,
  getBytesDecoder as getBytesDecoder30,
  getBytesEncoder as getBytesEncoder43,
  getStructDecoder as getStructDecoder31,
  getStructEncoder as getStructEncoder31,
  getU64Decoder as getU64Decoder18,
  getU64Encoder as getU64Encoder19,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS20,
  SolanaError as SolanaError20,
  transformEncoder as transformEncoder29
} from "@solana/kit";
import {
  getAccountMetaFactory as getAccountMetaFactory20
} from "@solana/kit/program-client-core";
var ROUTE_TOKEN_CREATOR_REVENUE_DISCRIMINATOR = new Uint8Array([248, 247, 236, 188, 45, 130, 117, 221]);
function getRouteTokenCreatorRevenueDiscriminatorBytes() {
  return fixEncoderSize30(getBytesEncoder43(), 8).encode(
    ROUTE_TOKEN_CREATOR_REVENUE_DISCRIMINATOR
  );
}
function getRouteTokenCreatorRevenueInstructionDataEncoder() {
  return transformEncoder29(
    getStructEncoder31([
      ["discriminator", fixEncoderSize30(getBytesEncoder43(), 8)],
      ["amount", getU64Encoder19()]
    ]),
    (value) => ({
      ...value,
      discriminator: ROUTE_TOKEN_CREATOR_REVENUE_DISCRIMINATOR
    })
  );
}
function getRouteTokenCreatorRevenueInstructionDataDecoder() {
  return getStructDecoder31([
    ["discriminator", fixDecoderSize30(getBytesDecoder30(), 8)],
    ["amount", getU64Decoder18()]
  ]);
}
function getRouteTokenCreatorRevenueInstructionDataCodec() {
  return combineCodec31(
    getRouteTokenCreatorRevenueInstructionDataEncoder(),
    getRouteTokenCreatorRevenueInstructionDataDecoder()
  );
}
function getRouteTokenCreatorRevenueInstruction(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory20(programAddress, "programId");
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
    throw new SolanaError20(
      SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS20,
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
  combineCodec as combineCodec32,
  fixDecoderSize as fixDecoderSize31,
  fixEncoderSize as fixEncoderSize31,
  getBooleanDecoder as getBooleanDecoder8,
  getBooleanEncoder as getBooleanEncoder8,
  getBytesDecoder as getBytesDecoder31,
  getBytesEncoder as getBytesEncoder44,
  getStructDecoder as getStructDecoder32,
  getStructEncoder as getStructEncoder32,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS21,
  SolanaError as SolanaError21,
  transformEncoder as transformEncoder30
} from "@solana/kit";
import {
  getAccountMetaFactory as getAccountMetaFactory21
} from "@solana/kit/program-client-core";
var SET_LISTING_APPROVED_DISCRIMINATOR = new Uint8Array([199, 59, 208, 95, 38, 69, 168, 183]);
function getSetListingApprovedDiscriminatorBytes() {
  return fixEncoderSize31(getBytesEncoder44(), 8).encode(
    SET_LISTING_APPROVED_DISCRIMINATOR
  );
}
function getSetListingApprovedInstructionDataEncoder() {
  return transformEncoder30(
    getStructEncoder32([
      ["discriminator", fixEncoderSize31(getBytesEncoder44(), 8)],
      ["approved", getBooleanEncoder8()]
    ]),
    (value) => ({
      ...value,
      discriminator: SET_LISTING_APPROVED_DISCRIMINATOR
    })
  );
}
function getSetListingApprovedInstructionDataDecoder() {
  return getStructDecoder32([
    ["discriminator", fixDecoderSize31(getBytesDecoder31(), 8)],
    ["approved", getBooleanDecoder8()]
  ]);
}
function getSetListingApprovedInstructionDataCodec() {
  return combineCodec32(
    getSetListingApprovedInstructionDataEncoder(),
    getSetListingApprovedInstructionDataDecoder()
  );
}
function getSetListingApprovedInstruction(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory21(programAddress, "programId");
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
    throw new SolanaError21(
      SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS21,
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

// clients/generated/instructions/setListingPermitExpiry.ts
import {
  combineCodec as combineCodec33,
  fixDecoderSize as fixDecoderSize32,
  fixEncoderSize as fixEncoderSize32,
  getBytesDecoder as getBytesDecoder32,
  getBytesEncoder as getBytesEncoder45,
  getI64Decoder as getI64Decoder8,
  getI64Encoder as getI64Encoder8,
  getStructDecoder as getStructDecoder33,
  getStructEncoder as getStructEncoder33,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS22,
  SolanaError as SolanaError22,
  transformEncoder as transformEncoder31
} from "@solana/kit";
import {
  getAccountMetaFactory as getAccountMetaFactory22,
  getAddressFromResolvedInstructionAccount as getAddressFromResolvedInstructionAccount18
} from "@solana/kit/program-client-core";
var SET_LISTING_PERMIT_EXPIRY_DISCRIMINATOR = new Uint8Array([211, 65, 230, 231, 156, 48, 13, 25]);
function getSetListingPermitExpiryDiscriminatorBytes() {
  return fixEncoderSize32(getBytesEncoder45(), 8).encode(
    SET_LISTING_PERMIT_EXPIRY_DISCRIMINATOR
  );
}
function getSetListingPermitExpiryInstructionDataEncoder() {
  return transformEncoder31(
    getStructEncoder33([
      ["discriminator", fixEncoderSize32(getBytesEncoder45(), 8)],
      ["expiresAt", getI64Encoder8()]
    ]),
    (value) => ({
      ...value,
      discriminator: SET_LISTING_PERMIT_EXPIRY_DISCRIMINATOR
    })
  );
}
function getSetListingPermitExpiryInstructionDataDecoder() {
  return getStructDecoder33([
    ["discriminator", fixDecoderSize32(getBytesDecoder32(), 8)],
    ["expiresAt", getI64Decoder8()]
  ]);
}
function getSetListingPermitExpiryInstructionDataCodec() {
  return combineCodec33(
    getSetListingPermitExpiryInstructionDataEncoder(),
    getSetListingPermitExpiryInstructionDataDecoder()
  );
}
async function getSetListingPermitExpiryInstructionAsync(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory22(programAddress, "programId");
  const originalAccounts = {
    admin: { value: input.admin ?? null, isSigner: true, isWritable: false },
    protocol: {
      value: input.protocol ?? null,
      isSigner: false,
      isWritable: false
    },
    permit: { value: input.permit ?? null, isSigner: false, isWritable: true }
  };
  const accounts = originalAccounts;
  const args = { ...input };
  if (!accounts.protocol.value) {
    accounts.protocol.value = await findProtocolPda(
      {
        admin: getAddressFromResolvedInstructionAccount18(
          "admin",
          accounts.admin.value
        )
      },
      { programAddress }
    );
  }
  return Object.freeze({
    accounts: [
      getAccountMeta("admin", accounts.admin),
      getAccountMeta("protocol", accounts.protocol),
      getAccountMeta("permit", accounts.permit)
    ],
    data: getSetListingPermitExpiryInstructionDataEncoder().encode(
      args
    ),
    programAddress
  });
}
function getSetListingPermitExpiryInstruction(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory22(programAddress, "programId");
  const originalAccounts = {
    admin: { value: input.admin ?? null, isSigner: true, isWritable: false },
    protocol: {
      value: input.protocol ?? null,
      isSigner: false,
      isWritable: false
    },
    permit: { value: input.permit ?? null, isSigner: false, isWritable: true }
  };
  const accounts = originalAccounts;
  const args = { ...input };
  return Object.freeze({
    accounts: [
      getAccountMeta("admin", accounts.admin),
      getAccountMeta("protocol", accounts.protocol),
      getAccountMeta("permit", accounts.permit)
    ],
    data: getSetListingPermitExpiryInstructionDataEncoder().encode(
      args
    ),
    programAddress
  });
}
function parseSetListingPermitExpiryInstruction(instruction) {
  if (instruction.accounts.length < 3) {
    throw new SolanaError22(
      SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS22,
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
      permit: getNextAccount()
    },
    data: getSetListingPermitExpiryInstructionDataDecoder().decode(
      instruction.data
    )
  };
}

// clients/generated/instructions/setMarketEnabled.ts
import {
  combineCodec as combineCodec34,
  fixDecoderSize as fixDecoderSize33,
  fixEncoderSize as fixEncoderSize33,
  getBooleanDecoder as getBooleanDecoder9,
  getBooleanEncoder as getBooleanEncoder9,
  getBytesDecoder as getBytesDecoder33,
  getBytesEncoder as getBytesEncoder46,
  getStructDecoder as getStructDecoder34,
  getStructEncoder as getStructEncoder34,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS23,
  SolanaError as SolanaError23,
  transformEncoder as transformEncoder32
} from "@solana/kit";
import {
  getAccountMetaFactory as getAccountMetaFactory23,
  getAddressFromResolvedInstructionAccount as getAddressFromResolvedInstructionAccount19
} from "@solana/kit/program-client-core";
var SET_MARKET_ENABLED_DISCRIMINATOR = new Uint8Array([206, 60, 159, 159, 62, 242, 4, 82]);
function getSetMarketEnabledDiscriminatorBytes() {
  return fixEncoderSize33(getBytesEncoder46(), 8).encode(
    SET_MARKET_ENABLED_DISCRIMINATOR
  );
}
function getSetMarketEnabledInstructionDataEncoder() {
  return transformEncoder32(
    getStructEncoder34([
      ["discriminator", fixEncoderSize33(getBytesEncoder46(), 8)],
      ["enabled", getBooleanEncoder9()]
    ]),
    (value) => ({ ...value, discriminator: SET_MARKET_ENABLED_DISCRIMINATOR })
  );
}
function getSetMarketEnabledInstructionDataDecoder() {
  return getStructDecoder34([
    ["discriminator", fixDecoderSize33(getBytesDecoder33(), 8)],
    ["enabled", getBooleanDecoder9()]
  ]);
}
function getSetMarketEnabledInstructionDataCodec() {
  return combineCodec34(
    getSetMarketEnabledInstructionDataEncoder(),
    getSetMarketEnabledInstructionDataDecoder()
  );
}
async function getSetMarketEnabledInstructionAsync(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory23(programAddress, "programId");
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
    },
    market: { value: input.market ?? null, isSigner: false, isWritable: true }
  };
  const accounts = originalAccounts;
  const args = { ...input };
  if (!accounts.protocol.value) {
    accounts.protocol.value = await findProtocolPda(
      {
        admin: getAddressFromResolvedInstructionAccount19(
          "admin",
          accounts.admin.value
        )
      },
      { programAddress }
    );
  }
  if (!accounts.market.value) {
    accounts.market.value = await findMarketPda(
      {
        listing: getAddressFromResolvedInstructionAccount19(
          "listing",
          accounts.listing.value
        )
      },
      { programAddress }
    );
  }
  return Object.freeze({
    accounts: [
      getAccountMeta("admin", accounts.admin),
      getAccountMeta("protocol", accounts.protocol),
      getAccountMeta("listing", accounts.listing),
      getAccountMeta("market", accounts.market)
    ],
    data: getSetMarketEnabledInstructionDataEncoder().encode(
      args
    ),
    programAddress
  });
}
function getSetMarketEnabledInstruction(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory23(programAddress, "programId");
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
    },
    market: { value: input.market ?? null, isSigner: false, isWritable: true }
  };
  const accounts = originalAccounts;
  const args = { ...input };
  return Object.freeze({
    accounts: [
      getAccountMeta("admin", accounts.admin),
      getAccountMeta("protocol", accounts.protocol),
      getAccountMeta("listing", accounts.listing),
      getAccountMeta("market", accounts.market)
    ],
    data: getSetMarketEnabledInstructionDataEncoder().encode(
      args
    ),
    programAddress
  });
}
function parseSetMarketEnabledInstruction(instruction) {
  if (instruction.accounts.length < 4) {
    throw new SolanaError23(
      SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS23,
      {
        actualAccountMetas: instruction.accounts.length,
        expectedAccountMetas: 4
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
      market: getNextAccount()
    },
    data: getSetMarketEnabledInstructionDataDecoder().decode(instruction.data)
  };
}

// clients/generated/instructions/setPaused.ts
import {
  combineCodec as combineCodec35,
  fixDecoderSize as fixDecoderSize34,
  fixEncoderSize as fixEncoderSize34,
  getBooleanDecoder as getBooleanDecoder10,
  getBooleanEncoder as getBooleanEncoder10,
  getBytesDecoder as getBytesDecoder34,
  getBytesEncoder as getBytesEncoder47,
  getStructDecoder as getStructDecoder35,
  getStructEncoder as getStructEncoder35,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS24,
  SolanaError as SolanaError24,
  transformEncoder as transformEncoder33
} from "@solana/kit";
import {
  getAccountMetaFactory as getAccountMetaFactory24
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
  return fixEncoderSize34(getBytesEncoder47(), 8).encode(SET_PAUSED_DISCRIMINATOR);
}
function getSetPausedInstructionDataEncoder() {
  return transformEncoder33(
    getStructEncoder35([
      ["discriminator", fixEncoderSize34(getBytesEncoder47(), 8)],
      ["paused", getBooleanEncoder10()]
    ]),
    (value) => ({ ...value, discriminator: SET_PAUSED_DISCRIMINATOR })
  );
}
function getSetPausedInstructionDataDecoder() {
  return getStructDecoder35([
    ["discriminator", fixDecoderSize34(getBytesDecoder34(), 8)],
    ["paused", getBooleanDecoder10()]
  ]);
}
function getSetPausedInstructionDataCodec() {
  return combineCodec35(
    getSetPausedInstructionDataEncoder(),
    getSetPausedInstructionDataDecoder()
  );
}
function getSetPausedInstruction(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory24(programAddress, "programId");
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
    throw new SolanaError24(
      SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS24,
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

// clients/generated/instructions/settlePosition.ts
import {
  combineCodec as combineCodec36,
  fixDecoderSize as fixDecoderSize35,
  fixEncoderSize as fixEncoderSize35,
  getBytesDecoder as getBytesDecoder35,
  getBytesEncoder as getBytesEncoder48,
  getStructDecoder as getStructDecoder36,
  getStructEncoder as getStructEncoder36,
  getU16Decoder as getU16Decoder4,
  getU16Encoder as getU16Encoder4,
  getU64Decoder as getU64Decoder19,
  getU64Encoder as getU64Encoder20,
  getU8Decoder as getU8Decoder11,
  getU8Encoder as getU8Encoder11,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS25,
  SolanaError as SolanaError25,
  transformEncoder as transformEncoder34
} from "@solana/kit";
import {
  getAccountMetaFactory as getAccountMetaFactory25,
  getAddressFromResolvedInstructionAccount as getAddressFromResolvedInstructionAccount20
} from "@solana/kit/program-client-core";
var SETTLE_POSITION_DISCRIMINATOR = new Uint8Array(
  [33, 156, 74, 218, 215, 42, 112, 175]
);
function getSettlePositionDiscriminatorBytes() {
  return fixEncoderSize35(getBytesEncoder48(), 8).encode(
    SETTLE_POSITION_DISCRIMINATOR
  );
}
function getSettlePositionInstructionDataEncoder() {
  return transformEncoder34(
    getStructEncoder36([
      ["discriminator", fixEncoderSize35(getBytesEncoder48(), 8)],
      ["reason", getU8Encoder11()],
      ["expectedPrice", getU64Encoder20()],
      ["slippageBps", getU16Encoder4()]
    ]),
    (value) => ({ ...value, discriminator: SETTLE_POSITION_DISCRIMINATOR })
  );
}
function getSettlePositionInstructionDataDecoder() {
  return getStructDecoder36([
    ["discriminator", fixDecoderSize35(getBytesDecoder35(), 8)],
    ["reason", getU8Decoder11()],
    ["expectedPrice", getU64Decoder19()],
    ["slippageBps", getU16Decoder4()]
  ]);
}
function getSettlePositionInstructionDataCodec() {
  return combineCodec36(
    getSettlePositionInstructionDataEncoder(),
    getSettlePositionInstructionDataDecoder()
  );
}
async function getSettlePositionInstructionAsync(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory25(programAddress, "programId");
  const originalAccounts = {
    actor: { value: input.actor ?? null, isSigner: true, isWritable: false },
    protocol: {
      value: input.protocol ?? null,
      isSigner: false,
      isWritable: false
    },
    market: { value: input.market ?? null, isSigner: false, isWritable: true },
    margin: { value: input.margin ?? null, isSigner: false, isWritable: true },
    position: {
      value: input.position ?? null,
      isSigner: false,
      isWritable: true
    },
    quoteMint: {
      value: input.quoteMint ?? null,
      isSigner: false,
      isWritable: false
    },
    userVault: {
      value: input.userVault ?? null,
      isSigner: false,
      isWritable: true
    },
    marketVault: {
      value: input.marketVault ?? null,
      isSigner: false,
      isWritable: true
    },
    actorTokens: {
      value: input.actorTokens ?? null,
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
  if (!accounts.userVault.value) {
    accounts.userVault.value = await findQuoteVaultPda(
      {
        margin: getAddressFromResolvedInstructionAccount20(
          "margin",
          accounts.margin.value
        )
      },
      { programAddress }
    );
  }
  if (!accounts.marketVault.value) {
    accounts.marketVault.value = await findMarketVaultPda(
      {
        market: getAddressFromResolvedInstructionAccount20(
          "market",
          accounts.market.value
        )
      },
      { programAddress }
    );
  }
  return Object.freeze({
    accounts: [
      getAccountMeta("actor", accounts.actor),
      getAccountMeta("protocol", accounts.protocol),
      getAccountMeta("market", accounts.market),
      getAccountMeta("margin", accounts.margin),
      getAccountMeta("position", accounts.position),
      getAccountMeta("quoteMint", accounts.quoteMint),
      getAccountMeta("userVault", accounts.userVault),
      getAccountMeta("marketVault", accounts.marketVault),
      getAccountMeta("actorTokens", accounts.actorTokens),
      getAccountMeta("quoteProgram", accounts.quoteProgram)
    ],
    data: getSettlePositionInstructionDataEncoder().encode(
      args
    ),
    programAddress
  });
}
function getSettlePositionInstruction(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory25(programAddress, "programId");
  const originalAccounts = {
    actor: { value: input.actor ?? null, isSigner: true, isWritable: false },
    protocol: {
      value: input.protocol ?? null,
      isSigner: false,
      isWritable: false
    },
    market: { value: input.market ?? null, isSigner: false, isWritable: true },
    margin: { value: input.margin ?? null, isSigner: false, isWritable: true },
    position: {
      value: input.position ?? null,
      isSigner: false,
      isWritable: true
    },
    quoteMint: {
      value: input.quoteMint ?? null,
      isSigner: false,
      isWritable: false
    },
    userVault: {
      value: input.userVault ?? null,
      isSigner: false,
      isWritable: true
    },
    marketVault: {
      value: input.marketVault ?? null,
      isSigner: false,
      isWritable: true
    },
    actorTokens: {
      value: input.actorTokens ?? null,
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
      getAccountMeta("actor", accounts.actor),
      getAccountMeta("protocol", accounts.protocol),
      getAccountMeta("market", accounts.market),
      getAccountMeta("margin", accounts.margin),
      getAccountMeta("position", accounts.position),
      getAccountMeta("quoteMint", accounts.quoteMint),
      getAccountMeta("userVault", accounts.userVault),
      getAccountMeta("marketVault", accounts.marketVault),
      getAccountMeta("actorTokens", accounts.actorTokens),
      getAccountMeta("quoteProgram", accounts.quoteProgram)
    ],
    data: getSettlePositionInstructionDataEncoder().encode(
      args
    ),
    programAddress
  });
}
function parseSettlePositionInstruction(instruction) {
  if (instruction.accounts.length < 10) {
    throw new SolanaError25(
      SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS25,
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
      actor: getNextAccount(),
      protocol: getNextAccount(),
      market: getNextAccount(),
      margin: getNextAccount(),
      position: getNextAccount(),
      quoteMint: getNextAccount(),
      userVault: getNextAccount(),
      marketVault: getNextAccount(),
      actorTokens: getNextAccount(),
      quoteProgram: getNextAccount()
    },
    data: getSettlePositionInstructionDataDecoder().decode(instruction.data)
  };
}

// clients/generated/instructions/withdraw.ts
import {
  combineCodec as combineCodec37,
  fixDecoderSize as fixDecoderSize36,
  fixEncoderSize as fixEncoderSize36,
  getBytesDecoder as getBytesDecoder36,
  getBytesEncoder as getBytesEncoder49,
  getStructDecoder as getStructDecoder37,
  getStructEncoder as getStructEncoder37,
  getU64Decoder as getU64Decoder20,
  getU64Encoder as getU64Encoder21,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS26,
  SolanaError as SolanaError26,
  transformEncoder as transformEncoder35
} from "@solana/kit";
import {
  getAccountMetaFactory as getAccountMetaFactory26,
  getAddressFromResolvedInstructionAccount as getAddressFromResolvedInstructionAccount21
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
  return fixEncoderSize36(getBytesEncoder49(), 8).encode(WITHDRAW_DISCRIMINATOR);
}
function getWithdrawInstructionDataEncoder() {
  return transformEncoder35(
    getStructEncoder37([
      ["discriminator", fixEncoderSize36(getBytesEncoder49(), 8)],
      ["amount", getU64Encoder21()]
    ]),
    (value) => ({ ...value, discriminator: WITHDRAW_DISCRIMINATOR })
  );
}
function getWithdrawInstructionDataDecoder() {
  return getStructDecoder37([
    ["discriminator", fixDecoderSize36(getBytesDecoder36(), 8)],
    ["amount", getU64Decoder20()]
  ]);
}
function getWithdrawInstructionDataCodec() {
  return combineCodec37(
    getWithdrawInstructionDataEncoder(),
    getWithdrawInstructionDataDecoder()
  );
}
async function getWithdrawInstructionAsync(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory26(programAddress, "programId");
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
        protocol: getAddressFromResolvedInstructionAccount21(
          "protocol",
          accounts.protocol.value
        ),
        owner: getAddressFromResolvedInstructionAccount21(
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
        margin: getAddressFromResolvedInstructionAccount21(
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
  const getAccountMeta = getAccountMetaFactory26(programAddress, "programId");
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
    throw new SolanaError26(
      SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS26,
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

// clients/generated/instructions/withdrawMarketLiquidity.ts
import {
  combineCodec as combineCodec38,
  fixDecoderSize as fixDecoderSize37,
  fixEncoderSize as fixEncoderSize37,
  getBytesDecoder as getBytesDecoder37,
  getBytesEncoder as getBytesEncoder50,
  getStructDecoder as getStructDecoder38,
  getStructEncoder as getStructEncoder38,
  getU64Decoder as getU64Decoder21,
  getU64Encoder as getU64Encoder22,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS27,
  SolanaError as SolanaError27,
  transformEncoder as transformEncoder36
} from "@solana/kit";
import {
  getAccountMetaFactory as getAccountMetaFactory27,
  getAddressFromResolvedInstructionAccount as getAddressFromResolvedInstructionAccount22
} from "@solana/kit/program-client-core";
var WITHDRAW_MARKET_LIQUIDITY_DISCRIMINATOR = new Uint8Array([151, 228, 127, 80, 156, 209, 76, 82]);
function getWithdrawMarketLiquidityDiscriminatorBytes() {
  return fixEncoderSize37(getBytesEncoder50(), 8).encode(
    WITHDRAW_MARKET_LIQUIDITY_DISCRIMINATOR
  );
}
function getWithdrawMarketLiquidityInstructionDataEncoder() {
  return transformEncoder36(
    getStructEncoder38([
      ["discriminator", fixEncoderSize37(getBytesEncoder50(), 8)],
      ["amount", getU64Encoder22()]
    ]),
    (value) => ({
      ...value,
      discriminator: WITHDRAW_MARKET_LIQUIDITY_DISCRIMINATOR
    })
  );
}
function getWithdrawMarketLiquidityInstructionDataDecoder() {
  return getStructDecoder38([
    ["discriminator", fixDecoderSize37(getBytesDecoder37(), 8)],
    ["amount", getU64Decoder21()]
  ]);
}
function getWithdrawMarketLiquidityInstructionDataCodec() {
  return combineCodec38(
    getWithdrawMarketLiquidityInstructionDataEncoder(),
    getWithdrawMarketLiquidityInstructionDataDecoder()
  );
}
async function getWithdrawMarketLiquidityInstructionAsync(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory27(programAddress, "programId");
  const originalAccounts = {
    lister: { value: input.lister ?? null, isSigner: true, isWritable: false },
    protocol: {
      value: input.protocol ?? null,
      isSigner: false,
      isWritable: false
    },
    market: { value: input.market ?? null, isSigner: false, isWritable: true },
    quoteMint: {
      value: input.quoteMint ?? null,
      isSigner: false,
      isWritable: false
    },
    marketVault: {
      value: input.marketVault ?? null,
      isSigner: false,
      isWritable: true
    },
    listerTokens: {
      value: input.listerTokens ?? null,
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
  if (!accounts.marketVault.value) {
    accounts.marketVault.value = await findMarketVaultPda(
      {
        market: getAddressFromResolvedInstructionAccount22(
          "market",
          accounts.market.value
        )
      },
      { programAddress }
    );
  }
  return Object.freeze({
    accounts: [
      getAccountMeta("lister", accounts.lister),
      getAccountMeta("protocol", accounts.protocol),
      getAccountMeta("market", accounts.market),
      getAccountMeta("quoteMint", accounts.quoteMint),
      getAccountMeta("marketVault", accounts.marketVault),
      getAccountMeta("listerTokens", accounts.listerTokens),
      getAccountMeta("quoteProgram", accounts.quoteProgram)
    ],
    data: getWithdrawMarketLiquidityInstructionDataEncoder().encode(
      args
    ),
    programAddress
  });
}
function getWithdrawMarketLiquidityInstruction(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory27(programAddress, "programId");
  const originalAccounts = {
    lister: { value: input.lister ?? null, isSigner: true, isWritable: false },
    protocol: {
      value: input.protocol ?? null,
      isSigner: false,
      isWritable: false
    },
    market: { value: input.market ?? null, isSigner: false, isWritable: true },
    quoteMint: {
      value: input.quoteMint ?? null,
      isSigner: false,
      isWritable: false
    },
    marketVault: {
      value: input.marketVault ?? null,
      isSigner: false,
      isWritable: true
    },
    listerTokens: {
      value: input.listerTokens ?? null,
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
      getAccountMeta("lister", accounts.lister),
      getAccountMeta("protocol", accounts.protocol),
      getAccountMeta("market", accounts.market),
      getAccountMeta("quoteMint", accounts.quoteMint),
      getAccountMeta("marketVault", accounts.marketVault),
      getAccountMeta("listerTokens", accounts.listerTokens),
      getAccountMeta("quoteProgram", accounts.quoteProgram)
    ],
    data: getWithdrawMarketLiquidityInstructionDataEncoder().encode(
      args
    ),
    programAddress
  });
}
function parseWithdrawMarketLiquidityInstruction(instruction) {
  if (instruction.accounts.length < 7) {
    throw new SolanaError27(
      SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS27,
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
      market: getNextAccount(),
      quoteMint: getNextAccount(),
      marketVault: getNextAccount(),
      listerTokens: getNextAccount(),
      quoteProgram: getNextAccount()
    },
    data: getWithdrawMarketLiquidityInstructionDataDecoder().decode(
      instruction.data
    )
  };
}

// clients/generated/instructions/wrapBuybackSol.ts
import {
  combineCodec as combineCodec39,
  fixDecoderSize as fixDecoderSize38,
  fixEncoderSize as fixEncoderSize38,
  getBytesDecoder as getBytesDecoder38,
  getBytesEncoder as getBytesEncoder51,
  getStructDecoder as getStructDecoder39,
  getStructEncoder as getStructEncoder39,
  getU64Decoder as getU64Decoder22,
  getU64Encoder as getU64Encoder23,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS28,
  SolanaError as SolanaError28,
  transformEncoder as transformEncoder37
} from "@solana/kit";
import {
  getAccountMetaFactory as getAccountMetaFactory28
} from "@solana/kit/program-client-core";
var WRAP_BUYBACK_SOL_DISCRIMINATOR = new Uint8Array([230, 81, 102, 81, 194, 180, 24, 22]);
function getWrapBuybackSolDiscriminatorBytes() {
  return fixEncoderSize38(getBytesEncoder51(), 8).encode(
    WRAP_BUYBACK_SOL_DISCRIMINATOR
  );
}
function getWrapBuybackSolInstructionDataEncoder() {
  return transformEncoder37(
    getStructEncoder39([
      ["discriminator", fixEncoderSize38(getBytesEncoder51(), 8)],
      ["amount", getU64Encoder23()]
    ]),
    (value) => ({ ...value, discriminator: WRAP_BUYBACK_SOL_DISCRIMINATOR })
  );
}
function getWrapBuybackSolInstructionDataDecoder() {
  return getStructDecoder39([
    ["discriminator", fixDecoderSize38(getBytesDecoder38(), 8)],
    ["amount", getU64Decoder22()]
  ]);
}
function getWrapBuybackSolInstructionDataCodec() {
  return combineCodec39(
    getWrapBuybackSolInstructionDataEncoder(),
    getWrapBuybackSolInstructionDataDecoder()
  );
}
function getWrapBuybackSolInstruction(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory28(programAddress, "programId");
  const originalAccounts = {
    authority: {
      value: input.authority ?? null,
      isSigner: true,
      isWritable: true
    },
    protocol: {
      value: input.protocol ?? null,
      isSigner: false,
      isWritable: false
    },
    wsolTokens: {
      value: input.wsolTokens ?? null,
      isSigner: false,
      isWritable: true
    },
    tokenProgram: {
      value: input.tokenProgram ?? null,
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
  if (!accounts.tokenProgram.value) {
    accounts.tokenProgram.value = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
  }
  if (!accounts.systemProgram.value) {
    accounts.systemProgram.value = "11111111111111111111111111111111";
  }
  return Object.freeze({
    accounts: [
      getAccountMeta("authority", accounts.authority),
      getAccountMeta("protocol", accounts.protocol),
      getAccountMeta("wsolTokens", accounts.wsolTokens),
      getAccountMeta("tokenProgram", accounts.tokenProgram),
      getAccountMeta("systemProgram", accounts.systemProgram)
    ],
    data: getWrapBuybackSolInstructionDataEncoder().encode(
      args
    ),
    programAddress
  });
}
function parseWrapBuybackSolInstruction(instruction) {
  if (instruction.accounts.length < 5) {
    throw new SolanaError28(
      SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS28,
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
      authority: getNextAccount(),
      protocol: getNextAccount(),
      wsolTokens: getNextAccount(),
      tokenProgram: getNextAccount(),
      systemProgram: getNextAccount()
    },
    data: getWrapBuybackSolInstructionDataDecoder().decode(instruction.data)
  };
}

// clients/generated/programs/levermeme.ts
var LEVERMEME_PROGRAM_ADDRESS = "Fg6PaFpoGXkYsidMpWxTWqkZ7FEfcYkgMQhgS1h5A9t";
var LevermemeAccount = /* @__PURE__ */ ((LevermemeAccount2) => {
  LevermemeAccount2[LevermemeAccount2["AirdropCampaign"] = 0] = "AirdropCampaign";
  LevermemeAccount2[LevermemeAccount2["AirdropClaim"] = 1] = "AirdropClaim";
  LevermemeAccount2[LevermemeAccount2["Listing"] = 2] = "Listing";
  LevermemeAccount2[LevermemeAccount2["ListingPermit"] = 3] = "ListingPermit";
  LevermemeAccount2[LevermemeAccount2["MarginAccount"] = 4] = "MarginAccount";
  LevermemeAccount2[LevermemeAccount2["Market"] = 5] = "Market";
  LevermemeAccount2[LevermemeAccount2["Position"] = 6] = "Position";
  LevermemeAccount2[LevermemeAccount2["Protocol"] = 7] = "Protocol";
  LevermemeAccount2[LevermemeAccount2["RevenueLedger"] = 8] = "RevenueLedger";
  return LevermemeAccount2;
})(LevermemeAccount || {});
function identifyLevermemeAccount(account) {
  const data = "data" in account ? account.data : account;
  if (containsBytes(
    data,
    fixEncoderSize39(getBytesEncoder52(), 8).encode(
      new Uint8Array([235, 102, 51, 70, 37, 179, 248, 13])
    ),
    0
  )) {
    return 0 /* AirdropCampaign */;
  }
  if (containsBytes(
    data,
    fixEncoderSize39(getBytesEncoder52(), 8).encode(
      new Uint8Array([231, 12, 74, 54, 245, 181, 248, 38])
    ),
    0
  )) {
    return 1 /* AirdropClaim */;
  }
  if (containsBytes(
    data,
    fixEncoderSize39(getBytesEncoder52(), 8).encode(
      new Uint8Array([218, 32, 50, 73, 43, 134, 26, 58])
    ),
    0
  )) {
    return 2 /* Listing */;
  }
  if (containsBytes(
    data,
    fixEncoderSize39(getBytesEncoder52(), 8).encode(
      new Uint8Array([117, 63, 230, 146, 238, 62, 186, 162])
    ),
    0
  )) {
    return 3 /* ListingPermit */;
  }
  if (containsBytes(
    data,
    fixEncoderSize39(getBytesEncoder52(), 8).encode(
      new Uint8Array([133, 220, 173, 213, 179, 211, 43, 238])
    ),
    0
  )) {
    return 4 /* MarginAccount */;
  }
  if (containsBytes(
    data,
    fixEncoderSize39(getBytesEncoder52(), 8).encode(
      new Uint8Array([219, 190, 213, 55, 0, 227, 198, 154])
    ),
    0
  )) {
    return 5 /* Market */;
  }
  if (containsBytes(
    data,
    fixEncoderSize39(getBytesEncoder52(), 8).encode(
      new Uint8Array([170, 188, 143, 228, 122, 64, 247, 208])
    ),
    0
  )) {
    return 6 /* Position */;
  }
  if (containsBytes(
    data,
    fixEncoderSize39(getBytesEncoder52(), 8).encode(
      new Uint8Array([45, 39, 101, 43, 115, 72, 131, 40])
    ),
    0
  )) {
    return 7 /* Protocol */;
  }
  if (containsBytes(
    data,
    fixEncoderSize39(getBytesEncoder52(), 8).encode(
      new Uint8Array([28, 159, 94, 108, 184, 213, 62, 53])
    ),
    0
  )) {
    return 8 /* RevenueLedger */;
  }
  throw new SolanaError29(
    SOLANA_ERROR__PROGRAM_CLIENTS__FAILED_TO_IDENTIFY_ACCOUNT,
    { accountData: data, programName: "levermeme" }
  );
}
var LevermemeEvent = /* @__PURE__ */ ((LevermemeEvent2) => {
  LevermemeEvent2[LevermemeEvent2["AirdropClaimed"] = 0] = "AirdropClaimed";
  LevermemeEvent2[LevermemeEvent2["AirdropCreated"] = 1] = "AirdropCreated";
  LevermemeEvent2[LevermemeEvent2["BuybackExecuted"] = 2] = "BuybackExecuted";
  LevermemeEvent2[LevermemeEvent2["CollateralChanged"] = 3] = "CollateralChanged";
  LevermemeEvent2[LevermemeEvent2["CreatorFeesCollected"] = 4] = "CreatorFeesCollected";
  LevermemeEvent2[LevermemeEvent2["ListingCancelled"] = 5] = "ListingCancelled";
  LevermemeEvent2[LevermemeEvent2["ListingRequested"] = 6] = "ListingRequested";
  LevermemeEvent2[LevermemeEvent2["ListingReviewed"] = 7] = "ListingReviewed";
  LevermemeEvent2[LevermemeEvent2["PauseChanged"] = 8] = "PauseChanged";
  LevermemeEvent2[LevermemeEvent2["PositionOpened"] = 9] = "PositionOpened";
  LevermemeEvent2[LevermemeEvent2["PositionSettled"] = 10] = "PositionSettled";
  LevermemeEvent2[LevermemeEvent2["PriceRefreshed"] = 11] = "PriceRefreshed";
  LevermemeEvent2[LevermemeEvent2["ProtocolCreated"] = 12] = "ProtocolCreated";
  LevermemeEvent2[LevermemeEvent2["RevenueRouted"] = 13] = "RevenueRouted";
  return LevermemeEvent2;
})(LevermemeEvent || {});
function identifyLevermemeEvent(event) {
  const data = "data" in event ? event.data : event;
  if (containsBytes(
    data,
    fixEncoderSize39(getBytesEncoder52(), 8).encode(
      new Uint8Array([125, 251, 195, 183, 202, 126, 89, 68])
    ),
    0
  )) {
    return 0 /* AirdropClaimed */;
  }
  if (containsBytes(
    data,
    fixEncoderSize39(getBytesEncoder52(), 8).encode(
      new Uint8Array([190, 219, 101, 33, 208, 187, 149, 96])
    ),
    0
  )) {
    return 1 /* AirdropCreated */;
  }
  if (containsBytes(
    data,
    fixEncoderSize39(getBytesEncoder52(), 8).encode(
      new Uint8Array([150, 109, 157, 10, 124, 24, 38, 189])
    ),
    0
  )) {
    return 2 /* BuybackExecuted */;
  }
  if (containsBytes(
    data,
    fixEncoderSize39(getBytesEncoder52(), 8).encode(
      new Uint8Array([172, 114, 48, 57, 98, 83, 95, 157])
    ),
    0
  )) {
    return 3 /* CollateralChanged */;
  }
  if (containsBytes(
    data,
    fixEncoderSize39(getBytesEncoder52(), 8).encode(
      new Uint8Array([117, 190, 177, 156, 222, 94, 28, 227])
    ),
    0
  )) {
    return 4 /* CreatorFeesCollected */;
  }
  if (containsBytes(
    data,
    fixEncoderSize39(getBytesEncoder52(), 8).encode(
      new Uint8Array([11, 46, 163, 10, 103, 80, 139, 194])
    ),
    0
  )) {
    return 5 /* ListingCancelled */;
  }
  if (containsBytes(
    data,
    fixEncoderSize39(getBytesEncoder52(), 8).encode(
      new Uint8Array([150, 236, 30, 166, 150, 162, 210, 167])
    ),
    0
  )) {
    return 6 /* ListingRequested */;
  }
  if (containsBytes(
    data,
    fixEncoderSize39(getBytesEncoder52(), 8).encode(
      new Uint8Array([33, 226, 137, 167, 158, 100, 9, 238])
    ),
    0
  )) {
    return 7 /* ListingReviewed */;
  }
  if (containsBytes(
    data,
    fixEncoderSize39(getBytesEncoder52(), 8).encode(
      new Uint8Array([238, 188, 213, 78, 134, 209, 178, 218])
    ),
    0
  )) {
    return 8 /* PauseChanged */;
  }
  if (containsBytes(
    data,
    fixEncoderSize39(getBytesEncoder52(), 8).encode(
      new Uint8Array([237, 175, 243, 230, 147, 117, 101, 121])
    ),
    0
  )) {
    return 9 /* PositionOpened */;
  }
  if (containsBytes(
    data,
    fixEncoderSize39(getBytesEncoder52(), 8).encode(
      new Uint8Array([75, 100, 92, 189, 245, 116, 252, 221])
    ),
    0
  )) {
    return 10 /* PositionSettled */;
  }
  if (containsBytes(
    data,
    fixEncoderSize39(getBytesEncoder52(), 8).encode(
      new Uint8Array([64, 39, 28, 72, 53, 221, 84, 139])
    ),
    0
  )) {
    return 11 /* PriceRefreshed */;
  }
  if (containsBytes(
    data,
    fixEncoderSize39(getBytesEncoder52(), 8).encode(
      new Uint8Array([15, 251, 247, 158, 97, 201, 1, 226])
    ),
    0
  )) {
    return 12 /* ProtocolCreated */;
  }
  if (containsBytes(
    data,
    fixEncoderSize39(getBytesEncoder52(), 8).encode(
      new Uint8Array([57, 95, 242, 242, 222, 199, 192, 120])
    ),
    0
  )) {
    return 13 /* RevenueRouted */;
  }
  throw new Error(
    "The provided event could not be identified as a levermeme event."
  );
}
var LevermemeInstruction = /* @__PURE__ */ ((LevermemeInstruction2) => {
  LevermemeInstruction2[LevermemeInstruction2["ApproveListingPermit"] = 0] = "ApproveListingPermit";
  LevermemeInstruction2[LevermemeInstruction2["CancelListing"] = 1] = "CancelListing";
  LevermemeInstruction2[LevermemeInstruction2["ClaimAirdrop"] = 2] = "ClaimAirdrop";
  LevermemeInstruction2[LevermemeInstruction2["CollectMarketFees"] = 3] = "CollectMarketFees";
  LevermemeInstruction2[LevermemeInstruction2["CollectNativeCreatorFees"] = 4] = "CollectNativeCreatorFees";
  LevermemeInstruction2[LevermemeInstruction2["CollectQuoteCreatorFees"] = 5] = "CollectQuoteCreatorFees";
  LevermemeInstruction2[LevermemeInstruction2["CreateAirdrop"] = 6] = "CreateAirdrop";
  LevermemeInstruction2[LevermemeInstruction2["CreateMarket"] = 7] = "CreateMarket";
  LevermemeInstruction2[LevermemeInstruction2["Deposit"] = 8] = "Deposit";
  LevermemeInstruction2[LevermemeInstruction2["ExecuteBuyback"] = 9] = "ExecuteBuyback";
  LevermemeInstruction2[LevermemeInstruction2["FundMarket"] = 10] = "FundMarket";
  LevermemeInstruction2[LevermemeInstruction2["InitializeProtocol"] = 11] = "InitializeProtocol";
  LevermemeInstruction2[LevermemeInstruction2["OpenMarginAccount"] = 12] = "OpenMarginAccount";
  LevermemeInstruction2[LevermemeInstruction2["OpenPosition"] = 13] = "OpenPosition";
  LevermemeInstruction2[LevermemeInstruction2["ReclaimAirdrop"] = 14] = "ReclaimAirdrop";
  LevermemeInstruction2[LevermemeInstruction2["RefreshMarketPrice"] = 15] = "RefreshMarketPrice";
  LevermemeInstruction2[LevermemeInstruction2["RequestListing"] = 16] = "RequestListing";
  LevermemeInstruction2[LevermemeInstruction2["RetireMarket"] = 17] = "RetireMarket";
  LevermemeInstruction2[LevermemeInstruction2["RoutePlatformRevenue"] = 18] = "RoutePlatformRevenue";
  LevermemeInstruction2[LevermemeInstruction2["RouteTokenCreatorRevenue"] = 19] = "RouteTokenCreatorRevenue";
  LevermemeInstruction2[LevermemeInstruction2["SetListingApproved"] = 20] = "SetListingApproved";
  LevermemeInstruction2[LevermemeInstruction2["SetListingPermitExpiry"] = 21] = "SetListingPermitExpiry";
  LevermemeInstruction2[LevermemeInstruction2["SetMarketEnabled"] = 22] = "SetMarketEnabled";
  LevermemeInstruction2[LevermemeInstruction2["SetPaused"] = 23] = "SetPaused";
  LevermemeInstruction2[LevermemeInstruction2["SettlePosition"] = 24] = "SettlePosition";
  LevermemeInstruction2[LevermemeInstruction2["Withdraw"] = 25] = "Withdraw";
  LevermemeInstruction2[LevermemeInstruction2["WithdrawMarketLiquidity"] = 26] = "WithdrawMarketLiquidity";
  LevermemeInstruction2[LevermemeInstruction2["WrapBuybackSol"] = 27] = "WrapBuybackSol";
  return LevermemeInstruction2;
})(LevermemeInstruction || {});
function identifyLevermemeInstruction(instruction) {
  const data = "data" in instruction ? instruction.data : instruction;
  if (containsBytes(
    data,
    fixEncoderSize39(getBytesEncoder52(), 8).encode(
      new Uint8Array([155, 67, 86, 117, 115, 161, 112, 127])
    ),
    0
  )) {
    return 0 /* ApproveListingPermit */;
  }
  if (containsBytes(
    data,
    fixEncoderSize39(getBytesEncoder52(), 8).encode(
      new Uint8Array([41, 183, 50, 232, 230, 233, 157, 70])
    ),
    0
  )) {
    return 1 /* CancelListing */;
  }
  if (containsBytes(
    data,
    fixEncoderSize39(getBytesEncoder52(), 8).encode(
      new Uint8Array([137, 50, 122, 111, 89, 254, 8, 20])
    ),
    0
  )) {
    return 2 /* ClaimAirdrop */;
  }
  if (containsBytes(
    data,
    fixEncoderSize39(getBytesEncoder52(), 8).encode(
      new Uint8Array([91, 210, 175, 55, 51, 117, 137, 238])
    ),
    0
  )) {
    return 3 /* CollectMarketFees */;
  }
  if (containsBytes(
    data,
    fixEncoderSize39(getBytesEncoder52(), 8).encode(
      new Uint8Array([220, 242, 50, 172, 89, 68, 83, 38])
    ),
    0
  )) {
    return 4 /* CollectNativeCreatorFees */;
  }
  if (containsBytes(
    data,
    fixEncoderSize39(getBytesEncoder52(), 8).encode(
      new Uint8Array([103, 255, 90, 194, 192, 129, 92, 158])
    ),
    0
  )) {
    return 5 /* CollectQuoteCreatorFees */;
  }
  if (containsBytes(
    data,
    fixEncoderSize39(getBytesEncoder52(), 8).encode(
      new Uint8Array([227, 135, 208, 66, 137, 177, 80, 94])
    ),
    0
  )) {
    return 6 /* CreateAirdrop */;
  }
  if (containsBytes(
    data,
    fixEncoderSize39(getBytesEncoder52(), 8).encode(
      new Uint8Array([103, 226, 97, 235, 200, 188, 251, 254])
    ),
    0
  )) {
    return 7 /* CreateMarket */;
  }
  if (containsBytes(
    data,
    fixEncoderSize39(getBytesEncoder52(), 8).encode(
      new Uint8Array([242, 35, 198, 137, 82, 225, 242, 182])
    ),
    0
  )) {
    return 8 /* Deposit */;
  }
  if (containsBytes(
    data,
    fixEncoderSize39(getBytesEncoder52(), 8).encode(
      new Uint8Array([47, 32, 19, 100, 184, 96, 144, 49])
    ),
    0
  )) {
    return 9 /* ExecuteBuyback */;
  }
  if (containsBytes(
    data,
    fixEncoderSize39(getBytesEncoder52(), 8).encode(
      new Uint8Array([173, 177, 32, 57, 20, 248, 119, 160])
    ),
    0
  )) {
    return 10 /* FundMarket */;
  }
  if (containsBytes(
    data,
    fixEncoderSize39(getBytesEncoder52(), 8).encode(
      new Uint8Array([188, 233, 252, 106, 134, 146, 202, 91])
    ),
    0
  )) {
    return 11 /* InitializeProtocol */;
  }
  if (containsBytes(
    data,
    fixEncoderSize39(getBytesEncoder52(), 8).encode(
      new Uint8Array([251, 54, 54, 233, 180, 125, 203, 107])
    ),
    0
  )) {
    return 12 /* OpenMarginAccount */;
  }
  if (containsBytes(
    data,
    fixEncoderSize39(getBytesEncoder52(), 8).encode(
      new Uint8Array([135, 128, 47, 77, 15, 152, 240, 49])
    ),
    0
  )) {
    return 13 /* OpenPosition */;
  }
  if (containsBytes(
    data,
    fixEncoderSize39(getBytesEncoder52(), 8).encode(
      new Uint8Array([91, 136, 224, 68, 150, 221, 18, 207])
    ),
    0
  )) {
    return 14 /* ReclaimAirdrop */;
  }
  if (containsBytes(
    data,
    fixEncoderSize39(getBytesEncoder52(), 8).encode(
      new Uint8Array([66, 92, 186, 127, 188, 0, 23, 207])
    ),
    0
  )) {
    return 15 /* RefreshMarketPrice */;
  }
  if (containsBytes(
    data,
    fixEncoderSize39(getBytesEncoder52(), 8).encode(
      new Uint8Array([2, 167, 98, 66, 122, 255, 254, 216])
    ),
    0
  )) {
    return 16 /* RequestListing */;
  }
  if (containsBytes(
    data,
    fixEncoderSize39(getBytesEncoder52(), 8).encode(
      new Uint8Array([68, 198, 103, 192, 149, 141, 34, 156])
    ),
    0
  )) {
    return 17 /* RetireMarket */;
  }
  if (containsBytes(
    data,
    fixEncoderSize39(getBytesEncoder52(), 8).encode(
      new Uint8Array([72, 200, 22, 148, 177, 183, 136, 29])
    ),
    0
  )) {
    return 18 /* RoutePlatformRevenue */;
  }
  if (containsBytes(
    data,
    fixEncoderSize39(getBytesEncoder52(), 8).encode(
      new Uint8Array([248, 247, 236, 188, 45, 130, 117, 221])
    ),
    0
  )) {
    return 19 /* RouteTokenCreatorRevenue */;
  }
  if (containsBytes(
    data,
    fixEncoderSize39(getBytesEncoder52(), 8).encode(
      new Uint8Array([199, 59, 208, 95, 38, 69, 168, 183])
    ),
    0
  )) {
    return 20 /* SetListingApproved */;
  }
  if (containsBytes(
    data,
    fixEncoderSize39(getBytesEncoder52(), 8).encode(
      new Uint8Array([211, 65, 230, 231, 156, 48, 13, 25])
    ),
    0
  )) {
    return 21 /* SetListingPermitExpiry */;
  }
  if (containsBytes(
    data,
    fixEncoderSize39(getBytesEncoder52(), 8).encode(
      new Uint8Array([206, 60, 159, 159, 62, 242, 4, 82])
    ),
    0
  )) {
    return 22 /* SetMarketEnabled */;
  }
  if (containsBytes(
    data,
    fixEncoderSize39(getBytesEncoder52(), 8).encode(
      new Uint8Array([91, 60, 125, 192, 176, 225, 166, 218])
    ),
    0
  )) {
    return 23 /* SetPaused */;
  }
  if (containsBytes(
    data,
    fixEncoderSize39(getBytesEncoder52(), 8).encode(
      new Uint8Array([33, 156, 74, 218, 215, 42, 112, 175])
    ),
    0
  )) {
    return 24 /* SettlePosition */;
  }
  if (containsBytes(
    data,
    fixEncoderSize39(getBytesEncoder52(), 8).encode(
      new Uint8Array([183, 18, 70, 156, 148, 109, 161, 34])
    ),
    0
  )) {
    return 25 /* Withdraw */;
  }
  if (containsBytes(
    data,
    fixEncoderSize39(getBytesEncoder52(), 8).encode(
      new Uint8Array([151, 228, 127, 80, 156, 209, 76, 82])
    ),
    0
  )) {
    return 26 /* WithdrawMarketLiquidity */;
  }
  if (containsBytes(
    data,
    fixEncoderSize39(getBytesEncoder52(), 8).encode(
      new Uint8Array([230, 81, 102, 81, 194, 180, 24, 22])
    ),
    0
  )) {
    return 27 /* WrapBuybackSol */;
  }
  throw new SolanaError29(
    SOLANA_ERROR__PROGRAM_CLIENTS__FAILED_TO_IDENTIFY_INSTRUCTION,
    { instructionData: data, programName: "levermeme" }
  );
}
function parseLevermemeInstruction(instruction) {
  const instructionType = identifyLevermemeInstruction(instruction);
  switch (instructionType) {
    case 0 /* ApproveListingPermit */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 0 /* ApproveListingPermit */,
        ...parseApproveListingPermitInstruction(instruction)
      };
    }
    case 1 /* CancelListing */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 1 /* CancelListing */,
        ...parseCancelListingInstruction(instruction)
      };
    }
    case 2 /* ClaimAirdrop */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 2 /* ClaimAirdrop */,
        ...parseClaimAirdropInstruction(instruction)
      };
    }
    case 3 /* CollectMarketFees */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 3 /* CollectMarketFees */,
        ...parseCollectMarketFeesInstruction(instruction)
      };
    }
    case 4 /* CollectNativeCreatorFees */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 4 /* CollectNativeCreatorFees */,
        ...parseCollectNativeCreatorFeesInstruction(instruction)
      };
    }
    case 5 /* CollectQuoteCreatorFees */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 5 /* CollectQuoteCreatorFees */,
        ...parseCollectQuoteCreatorFeesInstruction(instruction)
      };
    }
    case 6 /* CreateAirdrop */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 6 /* CreateAirdrop */,
        ...parseCreateAirdropInstruction(instruction)
      };
    }
    case 7 /* CreateMarket */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 7 /* CreateMarket */,
        ...parseCreateMarketInstruction(instruction)
      };
    }
    case 8 /* Deposit */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 8 /* Deposit */,
        ...parseDepositInstruction(instruction)
      };
    }
    case 9 /* ExecuteBuyback */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 9 /* ExecuteBuyback */,
        ...parseExecuteBuybackInstruction(instruction)
      };
    }
    case 10 /* FundMarket */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 10 /* FundMarket */,
        ...parseFundMarketInstruction(instruction)
      };
    }
    case 11 /* InitializeProtocol */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 11 /* InitializeProtocol */,
        ...parseInitializeProtocolInstruction(instruction)
      };
    }
    case 12 /* OpenMarginAccount */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 12 /* OpenMarginAccount */,
        ...parseOpenMarginAccountInstruction(instruction)
      };
    }
    case 13 /* OpenPosition */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 13 /* OpenPosition */,
        ...parseOpenPositionInstruction(instruction)
      };
    }
    case 14 /* ReclaimAirdrop */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 14 /* ReclaimAirdrop */,
        ...parseReclaimAirdropInstruction(instruction)
      };
    }
    case 15 /* RefreshMarketPrice */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 15 /* RefreshMarketPrice */,
        ...parseRefreshMarketPriceInstruction(instruction)
      };
    }
    case 16 /* RequestListing */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 16 /* RequestListing */,
        ...parseRequestListingInstruction(instruction)
      };
    }
    case 17 /* RetireMarket */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 17 /* RetireMarket */,
        ...parseRetireMarketInstruction(instruction)
      };
    }
    case 18 /* RoutePlatformRevenue */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 18 /* RoutePlatformRevenue */,
        ...parseRoutePlatformRevenueInstruction(instruction)
      };
    }
    case 19 /* RouteTokenCreatorRevenue */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 19 /* RouteTokenCreatorRevenue */,
        ...parseRouteTokenCreatorRevenueInstruction(instruction)
      };
    }
    case 20 /* SetListingApproved */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 20 /* SetListingApproved */,
        ...parseSetListingApprovedInstruction(instruction)
      };
    }
    case 21 /* SetListingPermitExpiry */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 21 /* SetListingPermitExpiry */,
        ...parseSetListingPermitExpiryInstruction(instruction)
      };
    }
    case 22 /* SetMarketEnabled */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 22 /* SetMarketEnabled */,
        ...parseSetMarketEnabledInstruction(instruction)
      };
    }
    case 23 /* SetPaused */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 23 /* SetPaused */,
        ...parseSetPausedInstruction(instruction)
      };
    }
    case 24 /* SettlePosition */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 24 /* SettlePosition */,
        ...parseSettlePositionInstruction(instruction)
      };
    }
    case 25 /* Withdraw */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 25 /* Withdraw */,
        ...parseWithdrawInstruction(instruction)
      };
    }
    case 26 /* WithdrawMarketLiquidity */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 26 /* WithdrawMarketLiquidity */,
        ...parseWithdrawMarketLiquidityInstruction(instruction)
      };
    }
    case 27 /* WrapBuybackSol */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 27 /* WrapBuybackSol */,
        ...parseWrapBuybackSolInstruction(instruction)
      };
    }
    default:
      throw new SolanaError29(
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
          listingPermit: addSelfFetchFunctions(client, getListingPermitCodec()),
          marginAccount: addSelfFetchFunctions(client, getMarginAccountCodec()),
          market: addSelfFetchFunctions(client, getMarketCodec()),
          position: addSelfFetchFunctions(client, getPositionCodec()),
          protocol: addSelfFetchFunctions(client, getProtocolCodec()),
          revenueLedger: addSelfFetchFunctions(client, getRevenueLedgerCodec())
        },
        instructions: {
          approveListingPermit: (input, instructionConfig) => addSelfPlanAndSendFunctions(
            client,
            getApproveListingPermitInstructionAsync(input, {
              programAddress: instructionConfig?.programAddress ?? config.programAddress
            })
          ),
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
          collectMarketFees: (input, instructionConfig) => addSelfPlanAndSendFunctions(
            client,
            getCollectMarketFeesInstructionAsync(input, {
              programAddress: instructionConfig?.programAddress ?? config.programAddress
            })
          ),
          collectNativeCreatorFees: (input, instructionConfig) => addSelfPlanAndSendFunctions(
            client,
            getCollectNativeCreatorFeesInstructionAsync(input, {
              programAddress: instructionConfig?.programAddress ?? config.programAddress
            })
          ),
          collectQuoteCreatorFees: (input, instructionConfig) => addSelfPlanAndSendFunctions(
            client,
            getCollectQuoteCreatorFeesInstructionAsync(input, {
              programAddress: instructionConfig?.programAddress ?? config.programAddress
            })
          ),
          createAirdrop: (input, instructionConfig) => addSelfPlanAndSendFunctions(
            client,
            getCreateAirdropInstructionAsync(input, {
              programAddress: instructionConfig?.programAddress ?? config.programAddress
            })
          ),
          createMarket: (input, instructionConfig) => addSelfPlanAndSendFunctions(
            client,
            getCreateMarketInstructionAsync(input, {
              programAddress: instructionConfig?.programAddress ?? config.programAddress
            })
          ),
          deposit: (input, instructionConfig) => addSelfPlanAndSendFunctions(
            client,
            getDepositInstructionAsync(input, {
              programAddress: instructionConfig?.programAddress ?? config.programAddress
            })
          ),
          executeBuyback: (input, instructionConfig) => addSelfPlanAndSendFunctions(
            client,
            getExecuteBuybackInstructionAsync(input, {
              programAddress: instructionConfig?.programAddress ?? config.programAddress
            })
          ),
          fundMarket: (input, instructionConfig) => addSelfPlanAndSendFunctions(
            client,
            getFundMarketInstructionAsync(input, {
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
          openPosition: (input, instructionConfig) => addSelfPlanAndSendFunctions(
            client,
            getOpenPositionInstructionAsync(input, {
              programAddress: instructionConfig?.programAddress ?? config.programAddress
            })
          ),
          reclaimAirdrop: (input, instructionConfig) => addSelfPlanAndSendFunctions(
            client,
            getReclaimAirdropInstructionAsync(input, {
              programAddress: instructionConfig?.programAddress ?? config.programAddress
            })
          ),
          refreshMarketPrice: (input, instructionConfig) => addSelfPlanAndSendFunctions(
            client,
            getRefreshMarketPriceInstruction(input, {
              programAddress: instructionConfig?.programAddress ?? config.programAddress
            })
          ),
          requestListing: (input, instructionConfig) => addSelfPlanAndSendFunctions(
            client,
            getRequestListingInstructionAsync(input, {
              programAddress: instructionConfig?.programAddress ?? config.programAddress
            })
          ),
          retireMarket: (input, instructionConfig) => addSelfPlanAndSendFunctions(
            client,
            getRetireMarketInstructionAsync(input, {
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
          setListingPermitExpiry: (input, instructionConfig) => addSelfPlanAndSendFunctions(
            client,
            getSetListingPermitExpiryInstructionAsync(input, {
              programAddress: instructionConfig?.programAddress ?? config.programAddress
            })
          ),
          setMarketEnabled: (input, instructionConfig) => addSelfPlanAndSendFunctions(
            client,
            getSetMarketEnabledInstructionAsync(input, {
              programAddress: instructionConfig?.programAddress ?? config.programAddress
            })
          ),
          setPaused: (input, instructionConfig) => addSelfPlanAndSendFunctions(
            client,
            getSetPausedInstruction(input, {
              programAddress: instructionConfig?.programAddress ?? config.programAddress
            })
          ),
          settlePosition: (input, instructionConfig) => addSelfPlanAndSendFunctions(
            client,
            getSettlePositionInstructionAsync(input, {
              programAddress: instructionConfig?.programAddress ?? config.programAddress
            })
          ),
          withdraw: (input, instructionConfig) => addSelfPlanAndSendFunctions(
            client,
            getWithdrawInstructionAsync(input, {
              programAddress: instructionConfig?.programAddress ?? config.programAddress
            })
          ),
          withdrawMarketLiquidity: (input, instructionConfig) => addSelfPlanAndSendFunctions(
            client,
            getWithdrawMarketLiquidityInstructionAsync(input, {
              programAddress: instructionConfig?.programAddress ?? config.programAddress
            })
          ),
          wrapBuybackSol: (input, instructionConfig) => addSelfPlanAndSendFunctions(
            client,
            getWrapBuybackSolInstruction(input, {
              programAddress: instructionConfig?.programAddress ?? config.programAddress
            })
          )
        },
        pdas: {
          protocol: (seeds, pdaConfig) => findProtocolPda(seeds, {
            programAddress: pdaConfig?.programAddress ?? config.programAddress
          }),
          permit: (seeds, pdaConfig) => findPermitPda(seeds, {
            programAddress: pdaConfig?.programAddress ?? config.programAddress
          }),
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
          market: (seeds, pdaConfig) => findMarketPda(seeds, {
            programAddress: pdaConfig?.programAddress ?? config.programAddress
          }),
          marketVault: (seeds, pdaConfig) => findMarketVaultPda(seeds, {
            programAddress: pdaConfig?.programAddress ?? config.programAddress
          }),
          revenue: (seeds, pdaConfig) => findRevenuePda(seeds, {
            programAddress: pdaConfig?.programAddress ?? config.programAddress
          }),
          margin: (seeds, pdaConfig) => findMarginPda(seeds, {
            programAddress: pdaConfig?.programAddress ?? config.programAddress
          }),
          quoteVault: (seeds, pdaConfig) => findQuoteVaultPda(seeds, {
            programAddress: pdaConfig?.programAddress ?? config.programAddress
          }),
          position: (seeds, pdaConfig) => findPositionPda(seeds, {
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
var LEVERMEME_ERROR__RISK = 6015;
var LEVERMEME_ERROR__MATH = 6016;
var LEVERMEME_ERROR__FUNDS = 6017;
var LEVERMEME_ERROR__RESERVED = 6018;
var LEVERMEME_ERROR__ADMISSION = 6019;
var LEVERMEME_ERROR__AMOUNT = 6020;
var LEVERMEME_ERROR__CLOSED = 6021;
var LEVERMEME_ERROR__ORACLE = 6022;
var LEVERMEME_ERROR__DEVIATION = 6023;
var LEVERMEME_ERROR__STALE = 6024;
var LEVERMEME_ERROR__REPLAY = 6025;
var LEVERMEME_ERROR__EXPOSURE = 6026;
var LEVERMEME_ERROR__SLIPPAGE = 6027;
var LEVERMEME_ERROR__OWNER = 6028;
var LEVERMEME_ERROR__HEALTHY = 6029;
var LEVERMEME_ERROR__CREATOR_IDENTITY = 6030;
var LEVERMEME_ERROR__BUYBACK_ROUTE = 6031;
var LEVERMEME_ERROR__BUYBACK_BOUNDS = 6032;
var levermemeErrorMessages;
if (process.env["NODE_ENV"] !== "production") {
  levermemeErrorMessages = {
    [LEVERMEME_ERROR__ADMISSION]: `Listing admission or review missing`,
    [LEVERMEME_ERROR__ALREADY_CANCELLED]: `Listing was already cancelled`,
    [LEVERMEME_ERROR__AMOUNT]: `Invalid amount or leverage`,
    [LEVERMEME_ERROR__BUYBACK_BOUNDS]: `Buyback input/output or authority balance bounds failed`,
    [LEVERMEME_ERROR__BUYBACK_ROUTE]: `Unsupported or unsafe buyback route/accounts`,
    [LEVERMEME_ERROR__CAMPAIGN_CLOSED]: `Airdrop has not started, has expired, or was reclaimed`,
    [LEVERMEME_ERROR__CLOSED]: `Market or position is closed`,
    [LEVERMEME_ERROR__CREATOR_IDENTITY]: `Creator identity, origin or fee vault was rejected`,
    [LEVERMEME_ERROR__DEVIATION]: `Oracle price deviates too far from reviewed TWAP`,
    [LEVERMEME_ERROR__EXPOSURE]: `Open interest limit exceeded`,
    [LEVERMEME_ERROR__FUNDS]: `Insufficient backing or vault invariant failed`,
    [LEVERMEME_ERROR__HEALTHY]: `Position is not liquidatable or at its profit cap`,
    [LEVERMEME_ERROR__INSUFFICIENT_FUNDS]: `Insufficient available balance`,
    [LEVERMEME_ERROR__INVALID_AMOUNT]: `The amount is zero or below the configured minimum`,
    [LEVERMEME_ERROR__INVALID_CAMPAIGN]: `Invalid campaign timing, root or proof length`,
    [LEVERMEME_ERROR__INVALID_POLICY]: `Invalid listing or fee policy`,
    [LEVERMEME_ERROR__INVALID_PROOF]: `Airdrop proof does not match this campaign, wallet, index and amount`,
    [LEVERMEME_ERROR__MATH]: `Checked arithmetic failed`,
    [LEVERMEME_ERROR__NOT_APPROVED]: `Market listing has not been approved, or was cancelled`,
    [LEVERMEME_ERROR__NOT_PUMP]: `The coin is not a verified pump.fun mint`,
    [LEVERMEME_ERROR__ORACLE]: `Oracle identity, quorum, feed or price rejected`,
    [LEVERMEME_ERROR__OVERFLOW]: `Arithmetic overflow`,
    [LEVERMEME_ERROR__OWNER]: `Only position owner can voluntarily close`,
    [LEVERMEME_ERROR__PAUSED]: `New listings and deposits are paused`,
    [LEVERMEME_ERROR__REPLAY]: `Position sequence is not current`,
    [LEVERMEME_ERROR__RESERVED]: `Liquidity is reserved for open positions`,
    [LEVERMEME_ERROR__RISK]: `Invalid immutable market risk policy`,
    [LEVERMEME_ERROR__SAME_MINT]: `Base, quote and burn mints must be distinct`,
    [LEVERMEME_ERROR__SLIPPAGE]: `Execution exceeds signed slippage limit`,
    [LEVERMEME_ERROR__STALE]: `Oracle is stale or emergency delay has not elapsed`,
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
  combineCodec as combineCodec40,
  containsBytes as containsBytes2,
  fixEncoderSize as fixEncoderSize40,
  getAddressDecoder as getAddressDecoder12,
  getAddressEncoder as getAddressEncoder28,
  getBytesEncoder as getBytesEncoder53,
  getConstantDecoder,
  getConstantEncoder,
  getHiddenPrefixDecoder,
  getHiddenPrefixEncoder,
  getStructDecoder as getStructDecoder40,
  getStructEncoder as getStructEncoder40,
  getU64Decoder as getU64Decoder23,
  getU64Encoder as getU64Encoder24
} from "@solana/kit";
var AIRDROP_CLAIMED_EVENT_DISCRIMINATOR = new Uint8Array([125, 251, 195, 183, 202, 126, 89, 68]);
function getAirdropClaimedEventDiscriminatorBytes() {
  return fixEncoderSize40(getBytesEncoder53(), 8).encode(
    AIRDROP_CLAIMED_EVENT_DISCRIMINATOR
  );
}
function getAirdropClaimedEventEncoder() {
  return getHiddenPrefixEncoder(
    getStructEncoder40([
      ["campaign", getAddressEncoder28()],
      ["owner", getAddressEncoder28()],
      ["amount", getU64Encoder24()]
    ]),
    [getConstantEncoder(AIRDROP_CLAIMED_EVENT_DISCRIMINATOR)]
  );
}
function getAirdropClaimedEventDecoder() {
  return getHiddenPrefixDecoder(
    getStructDecoder40([
      ["campaign", getAddressDecoder12()],
      ["owner", getAddressDecoder12()],
      ["amount", getU64Decoder23()]
    ]),
    [getConstantDecoder(AIRDROP_CLAIMED_EVENT_DISCRIMINATOR)]
  );
}
function getAirdropClaimedEventCodec() {
  return combineCodec40(
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
  combineCodec as combineCodec41,
  containsBytes as containsBytes3,
  fixEncoderSize as fixEncoderSize41,
  getAddressDecoder as getAddressDecoder13,
  getAddressEncoder as getAddressEncoder29,
  getBytesEncoder as getBytesEncoder54,
  getConstantDecoder as getConstantDecoder2,
  getConstantEncoder as getConstantEncoder2,
  getHiddenPrefixDecoder as getHiddenPrefixDecoder2,
  getHiddenPrefixEncoder as getHiddenPrefixEncoder2,
  getI64Decoder as getI64Decoder9,
  getI64Encoder as getI64Encoder9,
  getStructDecoder as getStructDecoder41,
  getStructEncoder as getStructEncoder41,
  getU64Decoder as getU64Decoder24,
  getU64Encoder as getU64Encoder25
} from "@solana/kit";
var AIRDROP_CREATED_EVENT_DISCRIMINATOR = new Uint8Array([190, 219, 101, 33, 208, 187, 149, 96]);
function getAirdropCreatedEventDiscriminatorBytes() {
  return fixEncoderSize41(getBytesEncoder54(), 8).encode(
    AIRDROP_CREATED_EVENT_DISCRIMINATOR
  );
}
function getAirdropCreatedEventEncoder() {
  return getHiddenPrefixEncoder2(
    getStructEncoder41([
      ["campaign", getAddressEncoder29()],
      ["total", getU64Encoder25()],
      ["startsAt", getI64Encoder9()],
      ["endsAt", getI64Encoder9()]
    ]),
    [getConstantEncoder2(AIRDROP_CREATED_EVENT_DISCRIMINATOR)]
  );
}
function getAirdropCreatedEventDecoder() {
  return getHiddenPrefixDecoder2(
    getStructDecoder41([
      ["campaign", getAddressDecoder13()],
      ["total", getU64Decoder24()],
      ["startsAt", getI64Decoder9()],
      ["endsAt", getI64Decoder9()]
    ]),
    [getConstantDecoder2(AIRDROP_CREATED_EVENT_DISCRIMINATOR)]
  );
}
function getAirdropCreatedEventCodec() {
  return combineCodec41(
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

// clients/generated/events/buybackExecuted.ts
import {
  combineCodec as combineCodec42,
  containsBytes as containsBytes4,
  fixEncoderSize as fixEncoderSize42,
  getAddressDecoder as getAddressDecoder14,
  getAddressEncoder as getAddressEncoder30,
  getBytesEncoder as getBytesEncoder55,
  getConstantDecoder as getConstantDecoder3,
  getConstantEncoder as getConstantEncoder3,
  getHiddenPrefixDecoder as getHiddenPrefixDecoder3,
  getHiddenPrefixEncoder as getHiddenPrefixEncoder3,
  getStructDecoder as getStructDecoder42,
  getStructEncoder as getStructEncoder42,
  getU64Decoder as getU64Decoder25,
  getU64Encoder as getU64Encoder26
} from "@solana/kit";
var BUYBACK_EXECUTED_EVENT_DISCRIMINATOR = new Uint8Array([150, 109, 157, 10, 124, 24, 38, 189]);
function getBuybackExecutedEventDiscriminatorBytes() {
  return fixEncoderSize42(getBytesEncoder55(), 8).encode(
    BUYBACK_EXECUTED_EVENT_DISCRIMINATOR
  );
}
function getBuybackExecutedEventEncoder() {
  return getHiddenPrefixEncoder3(
    getStructEncoder42([
      ["protocol", getAddressEncoder30()],
      ["authority", getAddressEncoder30()],
      ["inputMint", getAddressEncoder30()],
      ["inputAmount", getU64Encoder26()],
      ["burned", getU64Encoder26()]
    ]),
    [getConstantEncoder3(BUYBACK_EXECUTED_EVENT_DISCRIMINATOR)]
  );
}
function getBuybackExecutedEventDecoder() {
  return getHiddenPrefixDecoder3(
    getStructDecoder42([
      ["protocol", getAddressDecoder14()],
      ["authority", getAddressDecoder14()],
      ["inputMint", getAddressDecoder14()],
      ["inputAmount", getU64Decoder25()],
      ["burned", getU64Decoder25()]
    ]),
    [getConstantDecoder3(BUYBACK_EXECUTED_EVENT_DISCRIMINATOR)]
  );
}
function getBuybackExecutedEventCodec() {
  return combineCodec42(
    getBuybackExecutedEventEncoder(),
    getBuybackExecutedEventDecoder()
  );
}
function parseBuybackExecutedEvent(data) {
  if (containsBytes4(data, BUYBACK_EXECUTED_EVENT_DISCRIMINATOR, 0)) {
    return getBuybackExecutedEventDecoder().decode(data);
  }
  throw new Error(
    'The provided data does not match the "BuybackExecutedEvent" event discriminators.'
  );
}

// clients/generated/events/collateralChanged.ts
import {
  combineCodec as combineCodec43,
  containsBytes as containsBytes5,
  fixEncoderSize as fixEncoderSize43,
  getAddressDecoder as getAddressDecoder15,
  getAddressEncoder as getAddressEncoder31,
  getBooleanDecoder as getBooleanDecoder11,
  getBooleanEncoder as getBooleanEncoder11,
  getBytesEncoder as getBytesEncoder56,
  getConstantDecoder as getConstantDecoder4,
  getConstantEncoder as getConstantEncoder4,
  getHiddenPrefixDecoder as getHiddenPrefixDecoder4,
  getHiddenPrefixEncoder as getHiddenPrefixEncoder4,
  getStructDecoder as getStructDecoder43,
  getStructEncoder as getStructEncoder43,
  getU64Decoder as getU64Decoder26,
  getU64Encoder as getU64Encoder27
} from "@solana/kit";
var COLLATERAL_CHANGED_EVENT_DISCRIMINATOR = new Uint8Array([172, 114, 48, 57, 98, 83, 95, 157]);
function getCollateralChangedEventDiscriminatorBytes() {
  return fixEncoderSize43(getBytesEncoder56(), 8).encode(
    COLLATERAL_CHANGED_EVENT_DISCRIMINATOR
  );
}
function getCollateralChangedEventEncoder() {
  return getHiddenPrefixEncoder4(
    getStructEncoder43([
      ["margin", getAddressEncoder31()],
      ["owner", getAddressEncoder31()],
      ["amount", getU64Encoder27()],
      ["deposit", getBooleanEncoder11()],
      ["balance", getU64Encoder27()]
    ]),
    [getConstantEncoder4(COLLATERAL_CHANGED_EVENT_DISCRIMINATOR)]
  );
}
function getCollateralChangedEventDecoder() {
  return getHiddenPrefixDecoder4(
    getStructDecoder43([
      ["margin", getAddressDecoder15()],
      ["owner", getAddressDecoder15()],
      ["amount", getU64Decoder26()],
      ["deposit", getBooleanDecoder11()],
      ["balance", getU64Decoder26()]
    ]),
    [getConstantDecoder4(COLLATERAL_CHANGED_EVENT_DISCRIMINATOR)]
  );
}
function getCollateralChangedEventCodec() {
  return combineCodec43(
    getCollateralChangedEventEncoder(),
    getCollateralChangedEventDecoder()
  );
}
function parseCollateralChangedEvent(data) {
  if (containsBytes5(data, COLLATERAL_CHANGED_EVENT_DISCRIMINATOR, 0)) {
    return getCollateralChangedEventDecoder().decode(data);
  }
  throw new Error(
    'The provided data does not match the "CollateralChangedEvent" event discriminators.'
  );
}

// clients/generated/events/creatorFeesCollected.ts
import {
  combineCodec as combineCodec44,
  containsBytes as containsBytes6,
  fixEncoderSize as fixEncoderSize44,
  getAddressDecoder as getAddressDecoder16,
  getAddressEncoder as getAddressEncoder32,
  getBytesEncoder as getBytesEncoder57,
  getConstantDecoder as getConstantDecoder5,
  getConstantEncoder as getConstantEncoder5,
  getHiddenPrefixDecoder as getHiddenPrefixDecoder5,
  getHiddenPrefixEncoder as getHiddenPrefixEncoder5,
  getStructDecoder as getStructDecoder44,
  getStructEncoder as getStructEncoder44,
  getU64Decoder as getU64Decoder27,
  getU64Encoder as getU64Encoder28,
  getU8Decoder as getU8Decoder12,
  getU8Encoder as getU8Encoder12
} from "@solana/kit";
var CREATOR_FEES_COLLECTED_EVENT_DISCRIMINATOR = new Uint8Array([117, 190, 177, 156, 222, 94, 28, 227]);
function getCreatorFeesCollectedEventDiscriminatorBytes() {
  return fixEncoderSize44(getBytesEncoder57(), 8).encode(
    CREATOR_FEES_COLLECTED_EVENT_DISCRIMINATOR
  );
}
function getCreatorFeesCollectedEventEncoder() {
  return getHiddenPrefixEncoder5(
    getStructEncoder44([
      ["protocol", getAddressEncoder32()],
      ["creator", getAddressEncoder32()],
      ["mint", getAddressEncoder32()],
      ["amount", getU64Encoder28()],
      ["treasury", getU64Encoder28()],
      ["buyback", getU64Encoder28()],
      ["sourceKind", getU8Encoder12()]
    ]),
    [getConstantEncoder5(CREATOR_FEES_COLLECTED_EVENT_DISCRIMINATOR)]
  );
}
function getCreatorFeesCollectedEventDecoder() {
  return getHiddenPrefixDecoder5(
    getStructDecoder44([
      ["protocol", getAddressDecoder16()],
      ["creator", getAddressDecoder16()],
      ["mint", getAddressDecoder16()],
      ["amount", getU64Decoder27()],
      ["treasury", getU64Decoder27()],
      ["buyback", getU64Decoder27()],
      ["sourceKind", getU8Decoder12()]
    ]),
    [getConstantDecoder5(CREATOR_FEES_COLLECTED_EVENT_DISCRIMINATOR)]
  );
}
function getCreatorFeesCollectedEventCodec() {
  return combineCodec44(
    getCreatorFeesCollectedEventEncoder(),
    getCreatorFeesCollectedEventDecoder()
  );
}
function parseCreatorFeesCollectedEvent(data) {
  if (containsBytes6(data, CREATOR_FEES_COLLECTED_EVENT_DISCRIMINATOR, 0)) {
    return getCreatorFeesCollectedEventDecoder().decode(data);
  }
  throw new Error(
    'The provided data does not match the "CreatorFeesCollectedEvent" event discriminators.'
  );
}

// clients/generated/events/listingCancelled.ts
import {
  combineCodec as combineCodec45,
  containsBytes as containsBytes7,
  fixEncoderSize as fixEncoderSize45,
  getAddressDecoder as getAddressDecoder17,
  getAddressEncoder as getAddressEncoder33,
  getBytesEncoder as getBytesEncoder58,
  getConstantDecoder as getConstantDecoder6,
  getConstantEncoder as getConstantEncoder6,
  getHiddenPrefixDecoder as getHiddenPrefixDecoder6,
  getHiddenPrefixEncoder as getHiddenPrefixEncoder6,
  getStructDecoder as getStructDecoder45,
  getStructEncoder as getStructEncoder45
} from "@solana/kit";
var LISTING_CANCELLED_EVENT_DISCRIMINATOR = new Uint8Array([11, 46, 163, 10, 103, 80, 139, 194]);
function getListingCancelledEventDiscriminatorBytes() {
  return fixEncoderSize45(getBytesEncoder58(), 8).encode(
    LISTING_CANCELLED_EVENT_DISCRIMINATOR
  );
}
function getListingCancelledEventEncoder() {
  return getHiddenPrefixEncoder6(
    getStructEncoder45([
      ["listing", getAddressEncoder33()],
      ["lister", getAddressEncoder33()]
    ]),
    [getConstantEncoder6(LISTING_CANCELLED_EVENT_DISCRIMINATOR)]
  );
}
function getListingCancelledEventDecoder() {
  return getHiddenPrefixDecoder6(
    getStructDecoder45([
      ["listing", getAddressDecoder17()],
      ["lister", getAddressDecoder17()]
    ]),
    [getConstantDecoder6(LISTING_CANCELLED_EVENT_DISCRIMINATOR)]
  );
}
function getListingCancelledEventCodec() {
  return combineCodec45(
    getListingCancelledEventEncoder(),
    getListingCancelledEventDecoder()
  );
}
function parseListingCancelledEvent(data) {
  if (containsBytes7(data, LISTING_CANCELLED_EVENT_DISCRIMINATOR, 0)) {
    return getListingCancelledEventDecoder().decode(data);
  }
  throw new Error(
    'The provided data does not match the "ListingCancelledEvent" event discriminators.'
  );
}

// clients/generated/events/listingRequested.ts
import {
  combineCodec as combineCodec46,
  containsBytes as containsBytes8,
  fixEncoderSize as fixEncoderSize46,
  getAddressDecoder as getAddressDecoder18,
  getAddressEncoder as getAddressEncoder34,
  getBytesEncoder as getBytesEncoder59,
  getConstantDecoder as getConstantDecoder7,
  getConstantEncoder as getConstantEncoder7,
  getHiddenPrefixDecoder as getHiddenPrefixDecoder7,
  getHiddenPrefixEncoder as getHiddenPrefixEncoder7,
  getStructDecoder as getStructDecoder46,
  getStructEncoder as getStructEncoder46,
  getU64Decoder as getU64Decoder28,
  getU64Encoder as getU64Encoder29
} from "@solana/kit";
var LISTING_REQUESTED_EVENT_DISCRIMINATOR = new Uint8Array([150, 236, 30, 166, 150, 162, 210, 167]);
function getListingRequestedEventDiscriminatorBytes() {
  return fixEncoderSize46(getBytesEncoder59(), 8).encode(
    LISTING_REQUESTED_EVENT_DISCRIMINATOR
  );
}
function getListingRequestedEventEncoder() {
  return getHiddenPrefixEncoder7(
    getStructEncoder46([
      ["listing", getAddressEncoder34()],
      ["lister", getAddressEncoder34()],
      ["baseMint", getAddressEncoder34()],
      ["solLamports", getU64Encoder29()],
      ["tokenAmount", getU64Encoder29()],
      ["burned", getU64Encoder29()]
    ]),
    [getConstantEncoder7(LISTING_REQUESTED_EVENT_DISCRIMINATOR)]
  );
}
function getListingRequestedEventDecoder() {
  return getHiddenPrefixDecoder7(
    getStructDecoder46([
      ["listing", getAddressDecoder18()],
      ["lister", getAddressDecoder18()],
      ["baseMint", getAddressDecoder18()],
      ["solLamports", getU64Decoder28()],
      ["tokenAmount", getU64Decoder28()],
      ["burned", getU64Decoder28()]
    ]),
    [getConstantDecoder7(LISTING_REQUESTED_EVENT_DISCRIMINATOR)]
  );
}
function getListingRequestedEventCodec() {
  return combineCodec46(
    getListingRequestedEventEncoder(),
    getListingRequestedEventDecoder()
  );
}
function parseListingRequestedEvent(data) {
  if (containsBytes8(data, LISTING_REQUESTED_EVENT_DISCRIMINATOR, 0)) {
    return getListingRequestedEventDecoder().decode(data);
  }
  throw new Error(
    'The provided data does not match the "ListingRequestedEvent" event discriminators.'
  );
}

// clients/generated/events/listingReviewed.ts
import {
  combineCodec as combineCodec47,
  containsBytes as containsBytes9,
  fixEncoderSize as fixEncoderSize47,
  getAddressDecoder as getAddressDecoder19,
  getAddressEncoder as getAddressEncoder35,
  getBooleanDecoder as getBooleanDecoder12,
  getBooleanEncoder as getBooleanEncoder12,
  getBytesEncoder as getBytesEncoder60,
  getConstantDecoder as getConstantDecoder8,
  getConstantEncoder as getConstantEncoder8,
  getHiddenPrefixDecoder as getHiddenPrefixDecoder8,
  getHiddenPrefixEncoder as getHiddenPrefixEncoder8,
  getStructDecoder as getStructDecoder47,
  getStructEncoder as getStructEncoder47
} from "@solana/kit";
var LISTING_REVIEWED_EVENT_DISCRIMINATOR = new Uint8Array([33, 226, 137, 167, 158, 100, 9, 238]);
function getListingReviewedEventDiscriminatorBytes() {
  return fixEncoderSize47(getBytesEncoder60(), 8).encode(
    LISTING_REVIEWED_EVENT_DISCRIMINATOR
  );
}
function getListingReviewedEventEncoder() {
  return getHiddenPrefixEncoder8(
    getStructEncoder47([
      ["listing", getAddressEncoder35()],
      ["approved", getBooleanEncoder12()]
    ]),
    [getConstantEncoder8(LISTING_REVIEWED_EVENT_DISCRIMINATOR)]
  );
}
function getListingReviewedEventDecoder() {
  return getHiddenPrefixDecoder8(
    getStructDecoder47([
      ["listing", getAddressDecoder19()],
      ["approved", getBooleanDecoder12()]
    ]),
    [getConstantDecoder8(LISTING_REVIEWED_EVENT_DISCRIMINATOR)]
  );
}
function getListingReviewedEventCodec() {
  return combineCodec47(
    getListingReviewedEventEncoder(),
    getListingReviewedEventDecoder()
  );
}
function parseListingReviewedEvent(data) {
  if (containsBytes9(data, LISTING_REVIEWED_EVENT_DISCRIMINATOR, 0)) {
    return getListingReviewedEventDecoder().decode(data);
  }
  throw new Error(
    'The provided data does not match the "ListingReviewedEvent" event discriminators.'
  );
}

// clients/generated/events/pauseChanged.ts
import {
  combineCodec as combineCodec48,
  containsBytes as containsBytes10,
  fixEncoderSize as fixEncoderSize48,
  getAddressDecoder as getAddressDecoder20,
  getAddressEncoder as getAddressEncoder36,
  getBooleanDecoder as getBooleanDecoder13,
  getBooleanEncoder as getBooleanEncoder13,
  getBytesEncoder as getBytesEncoder61,
  getConstantDecoder as getConstantDecoder9,
  getConstantEncoder as getConstantEncoder9,
  getHiddenPrefixDecoder as getHiddenPrefixDecoder9,
  getHiddenPrefixEncoder as getHiddenPrefixEncoder9,
  getStructDecoder as getStructDecoder48,
  getStructEncoder as getStructEncoder48
} from "@solana/kit";
var PAUSE_CHANGED_EVENT_DISCRIMINATOR = new Uint8Array([238, 188, 213, 78, 134, 209, 178, 218]);
function getPauseChangedEventDiscriminatorBytes() {
  return fixEncoderSize48(getBytesEncoder61(), 8).encode(
    PAUSE_CHANGED_EVENT_DISCRIMINATOR
  );
}
function getPauseChangedEventEncoder() {
  return getHiddenPrefixEncoder9(
    getStructEncoder48([
      ["protocol", getAddressEncoder36()],
      ["paused", getBooleanEncoder13()]
    ]),
    [getConstantEncoder9(PAUSE_CHANGED_EVENT_DISCRIMINATOR)]
  );
}
function getPauseChangedEventDecoder() {
  return getHiddenPrefixDecoder9(
    getStructDecoder48([
      ["protocol", getAddressDecoder20()],
      ["paused", getBooleanDecoder13()]
    ]),
    [getConstantDecoder9(PAUSE_CHANGED_EVENT_DISCRIMINATOR)]
  );
}
function getPauseChangedEventCodec() {
  return combineCodec48(
    getPauseChangedEventEncoder(),
    getPauseChangedEventDecoder()
  );
}
function parsePauseChangedEvent(data) {
  if (containsBytes10(data, PAUSE_CHANGED_EVENT_DISCRIMINATOR, 0)) {
    return getPauseChangedEventDecoder().decode(data);
  }
  throw new Error(
    'The provided data does not match the "PauseChangedEvent" event discriminators.'
  );
}

// clients/generated/events/positionOpened.ts
import {
  combineCodec as combineCodec49,
  containsBytes as containsBytes11,
  fixEncoderSize as fixEncoderSize49,
  getAddressDecoder as getAddressDecoder21,
  getAddressEncoder as getAddressEncoder37,
  getBooleanDecoder as getBooleanDecoder14,
  getBooleanEncoder as getBooleanEncoder14,
  getBytesEncoder as getBytesEncoder62,
  getConstantDecoder as getConstantDecoder10,
  getConstantEncoder as getConstantEncoder10,
  getHiddenPrefixDecoder as getHiddenPrefixDecoder10,
  getHiddenPrefixEncoder as getHiddenPrefixEncoder10,
  getStructDecoder as getStructDecoder49,
  getStructEncoder as getStructEncoder49,
  getU64Decoder as getU64Decoder29,
  getU64Encoder as getU64Encoder30
} from "@solana/kit";
var POSITION_OPENED_EVENT_DISCRIMINATOR = new Uint8Array([237, 175, 243, 230, 147, 117, 101, 121]);
function getPositionOpenedEventDiscriminatorBytes() {
  return fixEncoderSize49(getBytesEncoder62(), 8).encode(
    POSITION_OPENED_EVENT_DISCRIMINATOR
  );
}
function getPositionOpenedEventEncoder() {
  return getHiddenPrefixEncoder10(
    getStructEncoder49([
      ["position", getAddressEncoder37()],
      ["owner", getAddressEncoder37()],
      ["market", getAddressEncoder37()],
      ["notional", getU64Encoder30()],
      ["collateral", getU64Encoder30()],
      ["entryPrice", getU64Encoder30()],
      ["maxProfit", getU64Encoder30()],
      ["long", getBooleanEncoder14()]
    ]),
    [getConstantEncoder10(POSITION_OPENED_EVENT_DISCRIMINATOR)]
  );
}
function getPositionOpenedEventDecoder() {
  return getHiddenPrefixDecoder10(
    getStructDecoder49([
      ["position", getAddressDecoder21()],
      ["owner", getAddressDecoder21()],
      ["market", getAddressDecoder21()],
      ["notional", getU64Decoder29()],
      ["collateral", getU64Decoder29()],
      ["entryPrice", getU64Decoder29()],
      ["maxProfit", getU64Decoder29()],
      ["long", getBooleanDecoder14()]
    ]),
    [getConstantDecoder10(POSITION_OPENED_EVENT_DISCRIMINATOR)]
  );
}
function getPositionOpenedEventCodec() {
  return combineCodec49(
    getPositionOpenedEventEncoder(),
    getPositionOpenedEventDecoder()
  );
}
function parsePositionOpenedEvent(data) {
  if (containsBytes11(data, POSITION_OPENED_EVENT_DISCRIMINATOR, 0)) {
    return getPositionOpenedEventDecoder().decode(data);
  }
  throw new Error(
    'The provided data does not match the "PositionOpenedEvent" event discriminators.'
  );
}

// clients/generated/events/positionSettled.ts
import {
  combineCodec as combineCodec50,
  containsBytes as containsBytes12,
  fixEncoderSize as fixEncoderSize50,
  getAddressDecoder as getAddressDecoder22,
  getAddressEncoder as getAddressEncoder38,
  getBytesEncoder as getBytesEncoder63,
  getConstantDecoder as getConstantDecoder11,
  getConstantEncoder as getConstantEncoder11,
  getHiddenPrefixDecoder as getHiddenPrefixDecoder11,
  getHiddenPrefixEncoder as getHiddenPrefixEncoder11,
  getStructDecoder as getStructDecoder50,
  getStructEncoder as getStructEncoder50,
  getU64Decoder as getU64Decoder30,
  getU64Encoder as getU64Encoder31,
  getU8Decoder as getU8Decoder13,
  getU8Encoder as getU8Encoder13
} from "@solana/kit";
var POSITION_SETTLED_EVENT_DISCRIMINATOR = new Uint8Array([75, 100, 92, 189, 245, 116, 252, 221]);
function getPositionSettledEventDiscriminatorBytes() {
  return fixEncoderSize50(getBytesEncoder63(), 8).encode(
    POSITION_SETTLED_EVENT_DISCRIMINATOR
  );
}
function getPositionSettledEventEncoder() {
  return getHiddenPrefixEncoder11(
    getStructEncoder50([
      ["position", getAddressEncoder38()],
      ["owner", getAddressEncoder38()],
      ["market", getAddressEncoder38()],
      ["payout", getU64Encoder31()],
      ["fee", getU64Encoder31()],
      ["bounty", getU64Encoder31()],
      ["exitPrice", getU64Encoder31()],
      ["reason", getU8Encoder13()]
    ]),
    [getConstantEncoder11(POSITION_SETTLED_EVENT_DISCRIMINATOR)]
  );
}
function getPositionSettledEventDecoder() {
  return getHiddenPrefixDecoder11(
    getStructDecoder50([
      ["position", getAddressDecoder22()],
      ["owner", getAddressDecoder22()],
      ["market", getAddressDecoder22()],
      ["payout", getU64Decoder30()],
      ["fee", getU64Decoder30()],
      ["bounty", getU64Decoder30()],
      ["exitPrice", getU64Decoder30()],
      ["reason", getU8Decoder13()]
    ]),
    [getConstantDecoder11(POSITION_SETTLED_EVENT_DISCRIMINATOR)]
  );
}
function getPositionSettledEventCodec() {
  return combineCodec50(
    getPositionSettledEventEncoder(),
    getPositionSettledEventDecoder()
  );
}
function parsePositionSettledEvent(data) {
  if (containsBytes12(data, POSITION_SETTLED_EVENT_DISCRIMINATOR, 0)) {
    return getPositionSettledEventDecoder().decode(data);
  }
  throw new Error(
    'The provided data does not match the "PositionSettledEvent" event discriminators.'
  );
}

// clients/generated/events/priceRefreshed.ts
import {
  combineCodec as combineCodec51,
  containsBytes as containsBytes13,
  fixEncoderSize as fixEncoderSize51,
  getAddressDecoder as getAddressDecoder23,
  getAddressEncoder as getAddressEncoder39,
  getBytesEncoder as getBytesEncoder64,
  getConstantDecoder as getConstantDecoder12,
  getConstantEncoder as getConstantEncoder12,
  getHiddenPrefixDecoder as getHiddenPrefixDecoder12,
  getHiddenPrefixEncoder as getHiddenPrefixEncoder12,
  getStructDecoder as getStructDecoder51,
  getStructEncoder as getStructEncoder51,
  getU64Decoder as getU64Decoder31,
  getU64Encoder as getU64Encoder32
} from "@solana/kit";
var PRICE_REFRESHED_EVENT_DISCRIMINATOR = new Uint8Array([64, 39, 28, 72, 53, 221, 84, 139]);
function getPriceRefreshedEventDiscriminatorBytes() {
  return fixEncoderSize51(getBytesEncoder64(), 8).encode(
    PRICE_REFRESHED_EVENT_DISCRIMINATOR
  );
}
function getPriceRefreshedEventEncoder() {
  return getHiddenPrefixEncoder12(
    getStructEncoder51([
      ["market", getAddressEncoder39()],
      ["price", getU64Encoder32()],
      ["slot", getU64Encoder32()]
    ]),
    [getConstantEncoder12(PRICE_REFRESHED_EVENT_DISCRIMINATOR)]
  );
}
function getPriceRefreshedEventDecoder() {
  return getHiddenPrefixDecoder12(
    getStructDecoder51([
      ["market", getAddressDecoder23()],
      ["price", getU64Decoder31()],
      ["slot", getU64Decoder31()]
    ]),
    [getConstantDecoder12(PRICE_REFRESHED_EVENT_DISCRIMINATOR)]
  );
}
function getPriceRefreshedEventCodec() {
  return combineCodec51(
    getPriceRefreshedEventEncoder(),
    getPriceRefreshedEventDecoder()
  );
}
function parsePriceRefreshedEvent(data) {
  if (containsBytes13(data, PRICE_REFRESHED_EVENT_DISCRIMINATOR, 0)) {
    return getPriceRefreshedEventDecoder().decode(data);
  }
  throw new Error(
    'The provided data does not match the "PriceRefreshedEvent" event discriminators.'
  );
}

// clients/generated/events/protocolCreated.ts
import {
  combineCodec as combineCodec52,
  containsBytes as containsBytes14,
  fixEncoderSize as fixEncoderSize52,
  getAddressDecoder as getAddressDecoder24,
  getAddressEncoder as getAddressEncoder40,
  getBytesEncoder as getBytesEncoder65,
  getConstantDecoder as getConstantDecoder13,
  getConstantEncoder as getConstantEncoder13,
  getHiddenPrefixDecoder as getHiddenPrefixDecoder13,
  getHiddenPrefixEncoder as getHiddenPrefixEncoder13,
  getStructDecoder as getStructDecoder52,
  getStructEncoder as getStructEncoder52
} from "@solana/kit";
var PROTOCOL_CREATED_EVENT_DISCRIMINATOR = new Uint8Array([15, 251, 247, 158, 97, 201, 1, 226]);
function getProtocolCreatedEventDiscriminatorBytes() {
  return fixEncoderSize52(getBytesEncoder65(), 8).encode(
    PROTOCOL_CREATED_EVENT_DISCRIMINATOR
  );
}
function getProtocolCreatedEventEncoder() {
  return getHiddenPrefixEncoder13(
    getStructEncoder52([
      ["protocol", getAddressEncoder40()],
      ["admin", getAddressEncoder40()]
    ]),
    [getConstantEncoder13(PROTOCOL_CREATED_EVENT_DISCRIMINATOR)]
  );
}
function getProtocolCreatedEventDecoder() {
  return getHiddenPrefixDecoder13(
    getStructDecoder52([
      ["protocol", getAddressDecoder24()],
      ["admin", getAddressDecoder24()]
    ]),
    [getConstantDecoder13(PROTOCOL_CREATED_EVENT_DISCRIMINATOR)]
  );
}
function getProtocolCreatedEventCodec() {
  return combineCodec52(
    getProtocolCreatedEventEncoder(),
    getProtocolCreatedEventDecoder()
  );
}
function parseProtocolCreatedEvent(data) {
  if (containsBytes14(data, PROTOCOL_CREATED_EVENT_DISCRIMINATOR, 0)) {
    return getProtocolCreatedEventDecoder().decode(data);
  }
  throw new Error(
    'The provided data does not match the "ProtocolCreatedEvent" event discriminators.'
  );
}

// clients/generated/events/revenueRouted.ts
import {
  combineCodec as combineCodec53,
  containsBytes as containsBytes15,
  fixEncoderSize as fixEncoderSize53,
  getAddressDecoder as getAddressDecoder25,
  getAddressEncoder as getAddressEncoder41,
  getArrayDecoder as getArrayDecoder3,
  getArrayEncoder as getArrayEncoder3,
  getBytesEncoder as getBytesEncoder66,
  getConstantDecoder as getConstantDecoder14,
  getConstantEncoder as getConstantEncoder14,
  getHiddenPrefixDecoder as getHiddenPrefixDecoder14,
  getHiddenPrefixEncoder as getHiddenPrefixEncoder14,
  getStructDecoder as getStructDecoder53,
  getStructEncoder as getStructEncoder53,
  getU64Decoder as getU64Decoder32,
  getU64Encoder as getU64Encoder33,
  getU8Decoder as getU8Decoder14,
  getU8Encoder as getU8Encoder14
} from "@solana/kit";
var REVENUE_ROUTED_EVENT_DISCRIMINATOR = new Uint8Array([57, 95, 242, 242, 222, 199, 192, 120]);
function getRevenueRoutedEventDiscriminatorBytes() {
  return fixEncoderSize53(getBytesEncoder66(), 8).encode(
    REVENUE_ROUTED_EVENT_DISCRIMINATOR
  );
}
function getRevenueRoutedEventEncoder() {
  return getHiddenPrefixEncoder14(
    getStructEncoder53([
      ["protocol", getAddressEncoder41()],
      ["amount", getU64Encoder33()],
      ["kind", getU8Encoder14()],
      ["parts", getArrayEncoder3(getU64Encoder33(), { size: 4 })]
    ]),
    [getConstantEncoder14(REVENUE_ROUTED_EVENT_DISCRIMINATOR)]
  );
}
function getRevenueRoutedEventDecoder() {
  return getHiddenPrefixDecoder14(
    getStructDecoder53([
      ["protocol", getAddressDecoder25()],
      ["amount", getU64Decoder32()],
      ["kind", getU8Decoder14()],
      ["parts", getArrayDecoder3(getU64Decoder32(), { size: 4 })]
    ]),
    [getConstantDecoder14(REVENUE_ROUTED_EVENT_DISCRIMINATOR)]
  );
}
function getRevenueRoutedEventCodec() {
  return combineCodec53(
    getRevenueRoutedEventEncoder(),
    getRevenueRoutedEventDecoder()
  );
}
function parseRevenueRoutedEvent(data) {
  if (containsBytes15(data, REVENUE_ROUTED_EVENT_DISCRIMINATOR, 0)) {
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
  APPROVE_LISTING_PERMIT_DISCRIMINATOR,
  BUYBACK_EXECUTED_EVENT_DISCRIMINATOR,
  CANCEL_LISTING_DISCRIMINATOR,
  CLAIM_AIRDROP_DISCRIMINATOR,
  COLLATERAL_CHANGED_EVENT_DISCRIMINATOR,
  COLLECT_MARKET_FEES_DISCRIMINATOR,
  COLLECT_NATIVE_CREATOR_FEES_DISCRIMINATOR,
  COLLECT_QUOTE_CREATOR_FEES_DISCRIMINATOR,
  CREATE_AIRDROP_DISCRIMINATOR,
  CREATE_MARKET_DISCRIMINATOR,
  CREATOR_FEES_COLLECTED_EVENT_DISCRIMINATOR,
  DEPOSIT_DISCRIMINATOR,
  EXECUTE_BUYBACK_DISCRIMINATOR,
  FUND_MARKET_DISCRIMINATOR,
  INITIALIZE_PROTOCOL_DISCRIMINATOR,
  LEVERMEME_ERROR__ADMISSION,
  LEVERMEME_ERROR__ALREADY_CANCELLED,
  LEVERMEME_ERROR__AMOUNT,
  LEVERMEME_ERROR__BUYBACK_BOUNDS,
  LEVERMEME_ERROR__BUYBACK_ROUTE,
  LEVERMEME_ERROR__CAMPAIGN_CLOSED,
  LEVERMEME_ERROR__CLOSED,
  LEVERMEME_ERROR__CREATOR_IDENTITY,
  LEVERMEME_ERROR__DEVIATION,
  LEVERMEME_ERROR__EXPOSURE,
  LEVERMEME_ERROR__FUNDS,
  LEVERMEME_ERROR__HEALTHY,
  LEVERMEME_ERROR__INSUFFICIENT_FUNDS,
  LEVERMEME_ERROR__INVALID_AMOUNT,
  LEVERMEME_ERROR__INVALID_CAMPAIGN,
  LEVERMEME_ERROR__INVALID_POLICY,
  LEVERMEME_ERROR__INVALID_PROOF,
  LEVERMEME_ERROR__MATH,
  LEVERMEME_ERROR__NOT_APPROVED,
  LEVERMEME_ERROR__NOT_PUMP,
  LEVERMEME_ERROR__ORACLE,
  LEVERMEME_ERROR__OVERFLOW,
  LEVERMEME_ERROR__OWNER,
  LEVERMEME_ERROR__PAUSED,
  LEVERMEME_ERROR__REPLAY,
  LEVERMEME_ERROR__RESERVED,
  LEVERMEME_ERROR__RISK,
  LEVERMEME_ERROR__SAME_MINT,
  LEVERMEME_ERROR__SLIPPAGE,
  LEVERMEME_ERROR__STALE,
  LEVERMEME_ERROR__TRANSFER_DELTA,
  LEVERMEME_ERROR__UNSAFE_EXTENSION,
  LEVERMEME_ERROR__UNSAFE_MINT,
  LEVERMEME_PROGRAM_ADDRESS,
  LISTING_CANCELLED_EVENT_DISCRIMINATOR,
  LISTING_DISCRIMINATOR,
  LISTING_PERMIT_DISCRIMINATOR,
  LISTING_REQUESTED_EVENT_DISCRIMINATOR,
  LISTING_REVIEWED_EVENT_DISCRIMINATOR,
  LevermemeAccount,
  LevermemeEvent,
  LevermemeInstruction,
  MARGIN_ACCOUNT_DISCRIMINATOR,
  MARKET_DISCRIMINATOR,
  OPEN_MARGIN_ACCOUNT_DISCRIMINATOR,
  OPEN_POSITION_DISCRIMINATOR,
  PAUSE_CHANGED_EVENT_DISCRIMINATOR,
  POSITION_DISCRIMINATOR,
  POSITION_OPENED_EVENT_DISCRIMINATOR,
  POSITION_SETTLED_EVENT_DISCRIMINATOR,
  PRICE_REFRESHED_EVENT_DISCRIMINATOR,
  PROTOCOL_CREATED_EVENT_DISCRIMINATOR,
  PROTOCOL_DISCRIMINATOR,
  RECLAIM_AIRDROP_DISCRIMINATOR,
  REFRESH_MARKET_PRICE_DISCRIMINATOR,
  REQUEST_LISTING_DISCRIMINATOR,
  RETIRE_MARKET_DISCRIMINATOR,
  REVENUE_LEDGER_DISCRIMINATOR,
  REVENUE_ROUTED_EVENT_DISCRIMINATOR,
  ROUTE_PLATFORM_REVENUE_DISCRIMINATOR,
  ROUTE_TOKEN_CREATOR_REVENUE_DISCRIMINATOR,
  SETTLE_POSITION_DISCRIMINATOR,
  SET_LISTING_APPROVED_DISCRIMINATOR,
  SET_LISTING_PERMIT_EXPIRY_DISCRIMINATOR,
  SET_MARKET_ENABLED_DISCRIMINATOR,
  SET_PAUSED_DISCRIMINATOR,
  WITHDRAW_DISCRIMINATOR,
  WITHDRAW_MARKET_LIQUIDITY_DISCRIMINATOR,
  WRAP_BUYBACK_SOL_DISCRIMINATOR,
  decodeAirdropCampaign,
  decodeAirdropClaim,
  decodeListing,
  decodeListingPermit,
  decodeMarginAccount,
  decodeMarket,
  decodePosition,
  decodeProtocol,
  decodeRevenueLedger,
  fetchAirdropCampaign,
  fetchAirdropClaim,
  fetchAllAirdropCampaign,
  fetchAllAirdropClaim,
  fetchAllListing,
  fetchAllListingPermit,
  fetchAllMarginAccount,
  fetchAllMarket,
  fetchAllMaybeAirdropCampaign,
  fetchAllMaybeAirdropClaim,
  fetchAllMaybeListing,
  fetchAllMaybeListingPermit,
  fetchAllMaybeMarginAccount,
  fetchAllMaybeMarket,
  fetchAllMaybePosition,
  fetchAllMaybeProtocol,
  fetchAllMaybeRevenueLedger,
  fetchAllPosition,
  fetchAllProtocol,
  fetchAllRevenueLedger,
  fetchListing,
  fetchListingPermit,
  fetchMarginAccount,
  fetchMarket,
  fetchMaybeAirdropCampaign,
  fetchMaybeAirdropClaim,
  fetchMaybeListing,
  fetchMaybeListingPermit,
  fetchMaybeMarginAccount,
  fetchMaybeMarket,
  fetchMaybePosition,
  fetchMaybeProtocol,
  fetchMaybeRevenueLedger,
  fetchPosition,
  fetchProtocol,
  fetchRevenueLedger,
  findAirdropVaultPda,
  findBaseVaultPda,
  findCampaignPda,
  findClaimPda,
  findListingPda,
  findMarginPda,
  findMarketPda,
  findMarketVaultPda,
  findPermitPda,
  findPositionPda,
  findProtocolPda,
  findQuoteVaultPda,
  findRevenuePda,
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
  getApproveListingPermitDiscriminatorBytes,
  getApproveListingPermitInstruction,
  getApproveListingPermitInstructionAsync,
  getApproveListingPermitInstructionDataCodec,
  getApproveListingPermitInstructionDataDecoder,
  getApproveListingPermitInstructionDataEncoder,
  getBuybackExecutedEventCodec,
  getBuybackExecutedEventDecoder,
  getBuybackExecutedEventDiscriminatorBytes,
  getBuybackExecutedEventEncoder,
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
  getCollectMarketFeesDiscriminatorBytes,
  getCollectMarketFeesInstruction,
  getCollectMarketFeesInstructionAsync,
  getCollectMarketFeesInstructionDataCodec,
  getCollectMarketFeesInstructionDataDecoder,
  getCollectMarketFeesInstructionDataEncoder,
  getCollectNativeCreatorFeesDiscriminatorBytes,
  getCollectNativeCreatorFeesInstruction,
  getCollectNativeCreatorFeesInstructionAsync,
  getCollectNativeCreatorFeesInstructionDataCodec,
  getCollectNativeCreatorFeesInstructionDataDecoder,
  getCollectNativeCreatorFeesInstructionDataEncoder,
  getCollectQuoteCreatorFeesDiscriminatorBytes,
  getCollectQuoteCreatorFeesInstruction,
  getCollectQuoteCreatorFeesInstructionAsync,
  getCollectQuoteCreatorFeesInstructionDataCodec,
  getCollectQuoteCreatorFeesInstructionDataDecoder,
  getCollectQuoteCreatorFeesInstructionDataEncoder,
  getCreateAirdropDiscriminatorBytes,
  getCreateAirdropInstruction,
  getCreateAirdropInstructionAsync,
  getCreateAirdropInstructionDataCodec,
  getCreateAirdropInstructionDataDecoder,
  getCreateAirdropInstructionDataEncoder,
  getCreateMarketDiscriminatorBytes,
  getCreateMarketInstruction,
  getCreateMarketInstructionAsync,
  getCreateMarketInstructionDataCodec,
  getCreateMarketInstructionDataDecoder,
  getCreateMarketInstructionDataEncoder,
  getCreatorFeesCollectedEventCodec,
  getCreatorFeesCollectedEventDecoder,
  getCreatorFeesCollectedEventDiscriminatorBytes,
  getCreatorFeesCollectedEventEncoder,
  getDepositDiscriminatorBytes,
  getDepositInstruction,
  getDepositInstructionAsync,
  getDepositInstructionDataCodec,
  getDepositInstructionDataDecoder,
  getDepositInstructionDataEncoder,
  getExecuteBuybackDiscriminatorBytes,
  getExecuteBuybackInstruction,
  getExecuteBuybackInstructionAsync,
  getExecuteBuybackInstructionDataCodec,
  getExecuteBuybackInstructionDataDecoder,
  getExecuteBuybackInstructionDataEncoder,
  getFundMarketDiscriminatorBytes,
  getFundMarketInstruction,
  getFundMarketInstructionAsync,
  getFundMarketInstructionDataCodec,
  getFundMarketInstructionDataDecoder,
  getFundMarketInstructionDataEncoder,
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
  getListingPermitCodec,
  getListingPermitDecoder,
  getListingPermitDiscriminatorBytes,
  getListingPermitEncoder,
  getListingPermitSize,
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
  getMarketCodec,
  getMarketDecoder,
  getMarketDiscriminatorBytes,
  getMarketEncoder,
  getMarketRiskCodec,
  getMarketRiskDecoder,
  getMarketRiskEncoder,
  getMarketSize,
  getOpenMarginAccountDiscriminatorBytes,
  getOpenMarginAccountInstruction,
  getOpenMarginAccountInstructionAsync,
  getOpenMarginAccountInstructionDataCodec,
  getOpenMarginAccountInstructionDataDecoder,
  getOpenMarginAccountInstructionDataEncoder,
  getOpenPositionDiscriminatorBytes,
  getOpenPositionInstruction,
  getOpenPositionInstructionAsync,
  getOpenPositionInstructionDataCodec,
  getOpenPositionInstructionDataDecoder,
  getOpenPositionInstructionDataEncoder,
  getPauseChangedEventCodec,
  getPauseChangedEventDecoder,
  getPauseChangedEventDiscriminatorBytes,
  getPauseChangedEventEncoder,
  getPositionCodec,
  getPositionDecoder,
  getPositionDiscriminatorBytes,
  getPositionEncoder,
  getPositionOpenedEventCodec,
  getPositionOpenedEventDecoder,
  getPositionOpenedEventDiscriminatorBytes,
  getPositionOpenedEventEncoder,
  getPositionSettledEventCodec,
  getPositionSettledEventDecoder,
  getPositionSettledEventDiscriminatorBytes,
  getPositionSettledEventEncoder,
  getPositionSize,
  getPriceRefreshedEventCodec,
  getPriceRefreshedEventDecoder,
  getPriceRefreshedEventDiscriminatorBytes,
  getPriceRefreshedEventEncoder,
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
  getRefreshMarketPriceDiscriminatorBytes,
  getRefreshMarketPriceInstruction,
  getRefreshMarketPriceInstructionDataCodec,
  getRefreshMarketPriceInstructionDataDecoder,
  getRefreshMarketPriceInstructionDataEncoder,
  getRequestListingDiscriminatorBytes,
  getRequestListingInstruction,
  getRequestListingInstructionAsync,
  getRequestListingInstructionDataCodec,
  getRequestListingInstructionDataDecoder,
  getRequestListingInstructionDataEncoder,
  getRetireMarketDiscriminatorBytes,
  getRetireMarketInstruction,
  getRetireMarketInstructionAsync,
  getRetireMarketInstructionDataCodec,
  getRetireMarketInstructionDataDecoder,
  getRetireMarketInstructionDataEncoder,
  getRevenueLedgerCodec,
  getRevenueLedgerDecoder,
  getRevenueLedgerDiscriminatorBytes,
  getRevenueLedgerEncoder,
  getRevenueLedgerSize,
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
  getSetListingPermitExpiryDiscriminatorBytes,
  getSetListingPermitExpiryInstruction,
  getSetListingPermitExpiryInstructionAsync,
  getSetListingPermitExpiryInstructionDataCodec,
  getSetListingPermitExpiryInstructionDataDecoder,
  getSetListingPermitExpiryInstructionDataEncoder,
  getSetMarketEnabledDiscriminatorBytes,
  getSetMarketEnabledInstruction,
  getSetMarketEnabledInstructionAsync,
  getSetMarketEnabledInstructionDataCodec,
  getSetMarketEnabledInstructionDataDecoder,
  getSetMarketEnabledInstructionDataEncoder,
  getSetPausedDiscriminatorBytes,
  getSetPausedInstruction,
  getSetPausedInstructionDataCodec,
  getSetPausedInstructionDataDecoder,
  getSetPausedInstructionDataEncoder,
  getSettlePositionDiscriminatorBytes,
  getSettlePositionInstruction,
  getSettlePositionInstructionAsync,
  getSettlePositionInstructionDataCodec,
  getSettlePositionInstructionDataDecoder,
  getSettlePositionInstructionDataEncoder,
  getWithdrawDiscriminatorBytes,
  getWithdrawInstruction,
  getWithdrawInstructionAsync,
  getWithdrawInstructionDataCodec,
  getWithdrawInstructionDataDecoder,
  getWithdrawInstructionDataEncoder,
  getWithdrawMarketLiquidityDiscriminatorBytes,
  getWithdrawMarketLiquidityInstruction,
  getWithdrawMarketLiquidityInstructionAsync,
  getWithdrawMarketLiquidityInstructionDataCodec,
  getWithdrawMarketLiquidityInstructionDataDecoder,
  getWithdrawMarketLiquidityInstructionDataEncoder,
  getWrapBuybackSolDiscriminatorBytes,
  getWrapBuybackSolInstruction,
  getWrapBuybackSolInstructionDataCodec,
  getWrapBuybackSolInstructionDataDecoder,
  getWrapBuybackSolInstructionDataEncoder,
  identifyLevermemeAccount,
  identifyLevermemeEvent,
  identifyLevermemeInstruction,
  isLevermemeError,
  levermemeProgram,
  parseAirdropClaimedEvent,
  parseAirdropCreatedEvent,
  parseApproveListingPermitInstruction,
  parseBuybackExecutedEvent,
  parseCancelListingInstruction,
  parseClaimAirdropInstruction,
  parseCollateralChangedEvent,
  parseCollectMarketFeesInstruction,
  parseCollectNativeCreatorFeesInstruction,
  parseCollectQuoteCreatorFeesInstruction,
  parseCreateAirdropInstruction,
  parseCreateMarketInstruction,
  parseCreatorFeesCollectedEvent,
  parseDepositInstruction,
  parseExecuteBuybackInstruction,
  parseFundMarketInstruction,
  parseInitializeProtocolInstruction,
  parseLevermemeInstruction,
  parseListingCancelledEvent,
  parseListingRequestedEvent,
  parseListingReviewedEvent,
  parseOpenMarginAccountInstruction,
  parseOpenPositionInstruction,
  parsePauseChangedEvent,
  parsePositionOpenedEvent,
  parsePositionSettledEvent,
  parsePriceRefreshedEvent,
  parseProtocolCreatedEvent,
  parseReclaimAirdropInstruction,
  parseRefreshMarketPriceInstruction,
  parseRequestListingInstruction,
  parseRetireMarketInstruction,
  parseRevenueRoutedEvent,
  parseRoutePlatformRevenueInstruction,
  parseRouteTokenCreatorRevenueInstruction,
  parseSetListingApprovedInstruction,
  parseSetListingPermitExpiryInstruction,
  parseSetMarketEnabledInstruction,
  parseSetPausedInstruction,
  parseSettlePositionInstruction,
  parseWithdrawInstruction,
  parseWithdrawMarketLiquidityInstruction,
  parseWrapBuybackSolInstruction
};
