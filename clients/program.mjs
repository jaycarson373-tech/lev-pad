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

// clients/generated/errors/levermeme.ts
import {
  isProgramError
} from "@solana/kit";

// clients/generated/programs/levermeme.ts
import {
  assertIsInstructionWithAccounts,
  containsBytes,
  extendClient,
  fixEncoderSize as fixEncoderSize34,
  getBytesEncoder as getBytesEncoder46,
  SOLANA_ERROR__PROGRAM_CLIENTS__FAILED_TO_IDENTIFY_ACCOUNT,
  SOLANA_ERROR__PROGRAM_CLIENTS__FAILED_TO_IDENTIFY_INSTRUCTION,
  SOLANA_ERROR__PROGRAM_CLIENTS__UNRECOGNIZED_INSTRUCTION_TYPE,
  SolanaError as SolanaError25
} from "@solana/kit";
import {
  addSelfFetchFunctions,
  addSelfPlanAndSendFunctions
} from "@solana/kit/program-client-core";

// clients/generated/instructions/approveListingPermit.ts
import {
  combineCodec as combineCodec11,
  fixDecoderSize as fixDecoderSize10,
  fixEncoderSize as fixEncoderSize10,
  getBytesDecoder as getBytesDecoder10,
  getBytesEncoder as getBytesEncoder22,
  getI64Decoder as getI64Decoder6,
  getI64Encoder as getI64Encoder6,
  getStructDecoder as getStructDecoder11,
  getStructEncoder as getStructEncoder11,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS,
  SolanaError,
  transformEncoder as transformEncoder9
} from "@solana/kit";
import {
  getAccountMetaFactory,
  getAddressFromResolvedInstructionAccount
} from "@solana/kit/program-client-core";

// clients/generated/pdas/airdropVault.ts
import {
  getAddressEncoder as getAddressEncoder11,
  getBytesEncoder as getBytesEncoder10,
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
      getBytesEncoder10().encode(
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
      getAddressEncoder11().encode(seeds.campaign)
    ]
  });
}

// clients/generated/pdas/baseVault.ts
import {
  getAddressEncoder as getAddressEncoder12,
  getBytesEncoder as getBytesEncoder11,
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
      getBytesEncoder11().encode(
        new Uint8Array([98, 97, 115, 101, 45, 118, 97, 117, 108, 116])
      ),
      getAddressEncoder12().encode(seeds.listing)
    ]
  });
}

// clients/generated/pdas/campaign.ts
import {
  getAddressEncoder as getAddressEncoder13,
  getBytesEncoder as getBytesEncoder12,
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
      getBytesEncoder12().encode(
        new Uint8Array([97, 105, 114, 100, 114, 111, 112])
      ),
      getAddressEncoder13().encode(seeds.protocol)
    ]
  });
}

// clients/generated/pdas/claim.ts
import {
  getAddressEncoder as getAddressEncoder14,
  getBytesEncoder as getBytesEncoder13,
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
      getBytesEncoder13().encode(new Uint8Array([99, 108, 97, 105, 109])),
      getAddressEncoder14().encode(seeds.campaign),
      getAddressEncoder14().encode(seeds.owner)
    ]
  });
}

// clients/generated/pdas/listing.ts
import {
  getAddressEncoder as getAddressEncoder15,
  getBytesEncoder as getBytesEncoder14,
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
      getBytesEncoder14().encode(
        new Uint8Array([108, 105, 115, 116, 105, 110, 103])
      ),
      getAddressEncoder15().encode(seeds.protocol),
      getAddressEncoder15().encode(seeds.baseMint)
    ]
  });
}

// clients/generated/pdas/margin.ts
import {
  getAddressEncoder as getAddressEncoder16,
  getBytesEncoder as getBytesEncoder15,
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
      getBytesEncoder15().encode(new Uint8Array([109, 97, 114, 103, 105, 110])),
      getAddressEncoder16().encode(seeds.protocol),
      getAddressEncoder16().encode(seeds.owner)
    ]
  });
}

// clients/generated/pdas/market.ts
import {
  getAddressEncoder as getAddressEncoder17,
  getBytesEncoder as getBytesEncoder16,
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
      getBytesEncoder16().encode(new Uint8Array([109, 97, 114, 107, 101, 116])),
      getAddressEncoder17().encode(seeds.listing)
    ]
  });
}

// clients/generated/pdas/marketVault.ts
import {
  getAddressEncoder as getAddressEncoder18,
  getBytesEncoder as getBytesEncoder17,
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
      getBytesEncoder17().encode(
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
      getAddressEncoder18().encode(seeds.market)
    ]
  });
}

// clients/generated/pdas/permit.ts
import {
  getAddressEncoder as getAddressEncoder19,
  getBytesEncoder as getBytesEncoder18,
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
      getBytesEncoder18().encode(
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
      getAddressEncoder19().encode(seeds.protocol),
      getAddressEncoder19().encode(seeds.baseMint),
      getAddressEncoder19().encode(seeds.lister)
    ]
  });
}

// clients/generated/pdas/position.ts
import {
  getAddressEncoder as getAddressEncoder20,
  getBytesEncoder as getBytesEncoder19,
  getProgramDerivedAddress as getProgramDerivedAddress10,
  getU64Encoder as getU64Encoder10
} from "@solana/kit";
async function findPositionPda(seeds, config = {}) {
  const {
    programAddress: programAddressInput = "Fg6PaFpoGXkYsidMpWxTWqkZ7FEfcYkgMQhgS1h5A9t"
  } = config;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  return await getProgramDerivedAddress10({
    programAddress,
    seeds: [
      getBytesEncoder19().encode(
        new Uint8Array([112, 111, 115, 105, 116, 105, 111, 110])
      ),
      getAddressEncoder20().encode(seeds.margin),
      getU64Encoder10().encode(seeds.id)
    ]
  });
}

// clients/generated/pdas/protocol.ts
import {
  getAddressEncoder as getAddressEncoder21,
  getBytesEncoder as getBytesEncoder20,
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
      getBytesEncoder20().encode(
        new Uint8Array([112, 114, 111, 116, 111, 99, 111, 108])
      ),
      getAddressEncoder21().encode(seeds.admin)
    ]
  });
}

// clients/generated/pdas/quoteVault.ts
import {
  getAddressEncoder as getAddressEncoder22,
  getBytesEncoder as getBytesEncoder21,
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
      getBytesEncoder21().encode(
        new Uint8Array([113, 117, 111, 116, 101, 45, 118, 97, 117, 108, 116])
      ),
      getAddressEncoder22().encode(seeds.margin)
    ]
  });
}

// clients/generated/instructions/approveListingPermit.ts
var APPROVE_LISTING_PERMIT_DISCRIMINATOR = new Uint8Array([155, 67, 86, 117, 115, 161, 112, 127]);
function getApproveListingPermitDiscriminatorBytes() {
  return fixEncoderSize10(getBytesEncoder22(), 8).encode(
    APPROVE_LISTING_PERMIT_DISCRIMINATOR
  );
}
function getApproveListingPermitInstructionDataEncoder() {
  return transformEncoder9(
    getStructEncoder11([
      ["discriminator", fixEncoderSize10(getBytesEncoder22(), 8)],
      ["expiresAt", getI64Encoder6()]
    ]),
    (value) => ({
      ...value,
      discriminator: APPROVE_LISTING_PERMIT_DISCRIMINATOR
    })
  );
}
function getApproveListingPermitInstructionDataDecoder() {
  return getStructDecoder11([
    ["discriminator", fixDecoderSize10(getBytesDecoder10(), 8)],
    ["expiresAt", getI64Decoder6()]
  ]);
}
function getApproveListingPermitInstructionDataCodec() {
  return combineCodec11(
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
  combineCodec as combineCodec12,
  fixDecoderSize as fixDecoderSize11,
  fixEncoderSize as fixEncoderSize11,
  getBytesDecoder as getBytesDecoder11,
  getBytesEncoder as getBytesEncoder23,
  getStructDecoder as getStructDecoder12,
  getStructEncoder as getStructEncoder12,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS2,
  SolanaError as SolanaError2,
  transformEncoder as transformEncoder10
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
  return fixEncoderSize11(getBytesEncoder23(), 8).encode(
    CANCEL_LISTING_DISCRIMINATOR
  );
}
function getCancelListingInstructionDataEncoder() {
  return transformEncoder10(
    getStructEncoder12([["discriminator", fixEncoderSize11(getBytesEncoder23(), 8)]]),
    (value) => ({ ...value, discriminator: CANCEL_LISTING_DISCRIMINATOR })
  );
}
function getCancelListingInstructionDataDecoder() {
  return getStructDecoder12([
    ["discriminator", fixDecoderSize11(getBytesDecoder11(), 8)]
  ]);
}
function getCancelListingInstructionDataCodec() {
  return combineCodec12(
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
  combineCodec as combineCodec13,
  fixDecoderSize as fixDecoderSize12,
  fixEncoderSize as fixEncoderSize12,
  getArrayDecoder as getArrayDecoder2,
  getArrayEncoder as getArrayEncoder2,
  getBytesDecoder as getBytesDecoder12,
  getBytesEncoder as getBytesEncoder24,
  getStructDecoder as getStructDecoder13,
  getStructEncoder as getStructEncoder13,
  getU64Decoder as getU64Decoder10,
  getU64Encoder as getU64Encoder11,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS3,
  SolanaError as SolanaError3,
  transformEncoder as transformEncoder11
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
  return fixEncoderSize12(getBytesEncoder24(), 8).encode(
    CLAIM_AIRDROP_DISCRIMINATOR
  );
}
function getClaimAirdropInstructionDataEncoder() {
  return transformEncoder11(
    getStructEncoder13([
      ["discriminator", fixEncoderSize12(getBytesEncoder24(), 8)],
      ["index", getU64Encoder11()],
      ["amount", getU64Encoder11()],
      ["proof", getArrayEncoder2(fixEncoderSize12(getBytesEncoder24(), 32))]
    ]),
    (value) => ({ ...value, discriminator: CLAIM_AIRDROP_DISCRIMINATOR })
  );
}
function getClaimAirdropInstructionDataDecoder() {
  return getStructDecoder13([
    ["discriminator", fixDecoderSize12(getBytesDecoder12(), 8)],
    ["index", getU64Decoder10()],
    ["amount", getU64Decoder10()],
    ["proof", getArrayDecoder2(fixDecoderSize12(getBytesDecoder12(), 32))]
  ]);
}
function getClaimAirdropInstructionDataCodec() {
  return combineCodec13(
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
  combineCodec as combineCodec14,
  fixDecoderSize as fixDecoderSize13,
  fixEncoderSize as fixEncoderSize13,
  getBytesDecoder as getBytesDecoder13,
  getBytesEncoder as getBytesEncoder25,
  getStructDecoder as getStructDecoder14,
  getStructEncoder as getStructEncoder14,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS4,
  SolanaError as SolanaError4,
  transformEncoder as transformEncoder12
} from "@solana/kit";
import {
  getAccountMetaFactory as getAccountMetaFactory4,
  getAddressFromResolvedInstructionAccount as getAddressFromResolvedInstructionAccount4
} from "@solana/kit/program-client-core";
var COLLECT_MARKET_FEES_DISCRIMINATOR = new Uint8Array([91, 210, 175, 55, 51, 117, 137, 238]);
function getCollectMarketFeesDiscriminatorBytes() {
  return fixEncoderSize13(getBytesEncoder25(), 8).encode(
    COLLECT_MARKET_FEES_DISCRIMINATOR
  );
}
function getCollectMarketFeesInstructionDataEncoder() {
  return transformEncoder12(
    getStructEncoder14([["discriminator", fixEncoderSize13(getBytesEncoder25(), 8)]]),
    (value) => ({ ...value, discriminator: COLLECT_MARKET_FEES_DISCRIMINATOR })
  );
}
function getCollectMarketFeesInstructionDataDecoder() {
  return getStructDecoder14([
    ["discriminator", fixDecoderSize13(getBytesDecoder13(), 8)]
  ]);
}
function getCollectMarketFeesInstructionDataCodec() {
  return combineCodec14(
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

// clients/generated/instructions/createAirdrop.ts
import {
  combineCodec as combineCodec15,
  fixDecoderSize as fixDecoderSize14,
  fixEncoderSize as fixEncoderSize14,
  getBytesDecoder as getBytesDecoder14,
  getBytesEncoder as getBytesEncoder26,
  getI64Decoder as getI64Decoder7,
  getI64Encoder as getI64Encoder7,
  getStructDecoder as getStructDecoder15,
  getStructEncoder as getStructEncoder15,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS5,
  SolanaError as SolanaError5,
  transformEncoder as transformEncoder13
} from "@solana/kit";
import {
  getAccountMetaFactory as getAccountMetaFactory5,
  getAddressFromResolvedInstructionAccount as getAddressFromResolvedInstructionAccount5
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
  return fixEncoderSize14(getBytesEncoder26(), 8).encode(
    CREATE_AIRDROP_DISCRIMINATOR
  );
}
function getCreateAirdropInstructionDataEncoder() {
  return transformEncoder13(
    getStructEncoder15([
      ["discriminator", fixEncoderSize14(getBytesEncoder26(), 8)],
      ["root", fixEncoderSize14(getBytesEncoder26(), 32)],
      ["startsAt", getI64Encoder7()],
      ["endsAt", getI64Encoder7()]
    ]),
    (value) => ({ ...value, discriminator: CREATE_AIRDROP_DISCRIMINATOR })
  );
}
function getCreateAirdropInstructionDataDecoder() {
  return getStructDecoder15([
    ["discriminator", fixDecoderSize14(getBytesDecoder14(), 8)],
    ["root", fixDecoderSize14(getBytesDecoder14(), 32)],
    ["startsAt", getI64Decoder7()],
    ["endsAt", getI64Decoder7()]
  ]);
}
function getCreateAirdropInstructionDataCodec() {
  return combineCodec15(
    getCreateAirdropInstructionDataEncoder(),
    getCreateAirdropInstructionDataDecoder()
  );
}
async function getCreateAirdropInstructionAsync(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory5(programAddress, "programId");
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
        protocol: getAddressFromResolvedInstructionAccount5(
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
        campaign: getAddressFromResolvedInstructionAccount5(
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
  const getAccountMeta = getAccountMetaFactory5(programAddress, "programId");
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
    throw new SolanaError5(
      SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS5,
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
  combineCodec as combineCodec16,
  fixDecoderSize as fixDecoderSize15,
  fixEncoderSize as fixEncoderSize15,
  getBytesDecoder as getBytesDecoder15,
  getBytesEncoder as getBytesEncoder27,
  getStructDecoder as getStructDecoder16,
  getStructEncoder as getStructEncoder16,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS6,
  SolanaError as SolanaError6,
  transformEncoder as transformEncoder14
} from "@solana/kit";
import {
  getAccountMetaFactory as getAccountMetaFactory6,
  getAddressFromResolvedInstructionAccount as getAddressFromResolvedInstructionAccount6
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
  return fixEncoderSize15(getBytesEncoder27(), 8).encode(
    CREATE_MARKET_DISCRIMINATOR
  );
}
function getCreateMarketInstructionDataEncoder() {
  return transformEncoder14(
    getStructEncoder16([
      ["discriminator", fixEncoderSize15(getBytesEncoder27(), 8)],
      ["risk", getMarketRiskEncoder()]
    ]),
    (value) => ({ ...value, discriminator: CREATE_MARKET_DISCRIMINATOR })
  );
}
function getCreateMarketInstructionDataDecoder() {
  return getStructDecoder16([
    ["discriminator", fixDecoderSize15(getBytesDecoder15(), 8)],
    ["risk", getMarketRiskDecoder()]
  ]);
}
function getCreateMarketInstructionDataCodec() {
  return combineCodec16(
    getCreateMarketInstructionDataEncoder(),
    getCreateMarketInstructionDataDecoder()
  );
}
async function getCreateMarketInstructionAsync(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory6(programAddress, "programId");
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
        admin: getAddressFromResolvedInstructionAccount6(
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
        listing: getAddressFromResolvedInstructionAccount6(
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
        market: getAddressFromResolvedInstructionAccount6(
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
  const getAccountMeta = getAccountMetaFactory6(programAddress, "programId");
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
    throw new SolanaError6(
      SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS6,
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
  combineCodec as combineCodec17,
  fixDecoderSize as fixDecoderSize16,
  fixEncoderSize as fixEncoderSize16,
  getBytesDecoder as getBytesDecoder16,
  getBytesEncoder as getBytesEncoder28,
  getStructDecoder as getStructDecoder17,
  getStructEncoder as getStructEncoder17,
  getU64Decoder as getU64Decoder11,
  getU64Encoder as getU64Encoder12,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS7,
  SolanaError as SolanaError7,
  transformEncoder as transformEncoder15
} from "@solana/kit";
import {
  getAccountMetaFactory as getAccountMetaFactory7,
  getAddressFromResolvedInstructionAccount as getAddressFromResolvedInstructionAccount7
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
  return fixEncoderSize16(getBytesEncoder28(), 8).encode(DEPOSIT_DISCRIMINATOR);
}
function getDepositInstructionDataEncoder() {
  return transformEncoder15(
    getStructEncoder17([
      ["discriminator", fixEncoderSize16(getBytesEncoder28(), 8)],
      ["amount", getU64Encoder12()]
    ]),
    (value) => ({ ...value, discriminator: DEPOSIT_DISCRIMINATOR })
  );
}
function getDepositInstructionDataDecoder() {
  return getStructDecoder17([
    ["discriminator", fixDecoderSize16(getBytesDecoder16(), 8)],
    ["amount", getU64Decoder11()]
  ]);
}
function getDepositInstructionDataCodec() {
  return combineCodec17(
    getDepositInstructionDataEncoder(),
    getDepositInstructionDataDecoder()
  );
}
async function getDepositInstructionAsync(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory7(programAddress, "programId");
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
        protocol: getAddressFromResolvedInstructionAccount7(
          "protocol",
          accounts.protocol.value
        ),
        owner: getAddressFromResolvedInstructionAccount7(
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
        margin: getAddressFromResolvedInstructionAccount7(
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
  const getAccountMeta = getAccountMetaFactory7(programAddress, "programId");
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

// clients/generated/instructions/fundMarket.ts
import {
  combineCodec as combineCodec18,
  fixDecoderSize as fixDecoderSize17,
  fixEncoderSize as fixEncoderSize17,
  getBytesDecoder as getBytesDecoder17,
  getBytesEncoder as getBytesEncoder29,
  getStructDecoder as getStructDecoder18,
  getStructEncoder as getStructEncoder18,
  getU64Decoder as getU64Decoder12,
  getU64Encoder as getU64Encoder13,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS8,
  SolanaError as SolanaError8,
  transformEncoder as transformEncoder16
} from "@solana/kit";
import {
  getAccountMetaFactory as getAccountMetaFactory8,
  getAddressFromResolvedInstructionAccount as getAddressFromResolvedInstructionAccount8
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
  return fixEncoderSize17(getBytesEncoder29(), 8).encode(FUND_MARKET_DISCRIMINATOR);
}
function getFundMarketInstructionDataEncoder() {
  return transformEncoder16(
    getStructEncoder18([
      ["discriminator", fixEncoderSize17(getBytesEncoder29(), 8)],
      ["amount", getU64Encoder13()]
    ]),
    (value) => ({ ...value, discriminator: FUND_MARKET_DISCRIMINATOR })
  );
}
function getFundMarketInstructionDataDecoder() {
  return getStructDecoder18([
    ["discriminator", fixDecoderSize17(getBytesDecoder17(), 8)],
    ["amount", getU64Decoder12()]
  ]);
}
function getFundMarketInstructionDataCodec() {
  return combineCodec18(
    getFundMarketInstructionDataEncoder(),
    getFundMarketInstructionDataDecoder()
  );
}
async function getFundMarketInstructionAsync(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory8(programAddress, "programId");
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
        market: getAddressFromResolvedInstructionAccount8(
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
  const getAccountMeta = getAccountMetaFactory8(programAddress, "programId");
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
    throw new SolanaError8(
      SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS8,
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
  combineCodec as combineCodec19,
  fixDecoderSize as fixDecoderSize18,
  fixEncoderSize as fixEncoderSize18,
  getAddressEncoder as getAddressEncoder23,
  getBytesDecoder as getBytesDecoder18,
  getBytesEncoder as getBytesEncoder30,
  getProgramDerivedAddress as getProgramDerivedAddress13,
  getStructDecoder as getStructDecoder19,
  getStructEncoder as getStructEncoder19,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS9,
  SolanaError as SolanaError9,
  transformEncoder as transformEncoder17
} from "@solana/kit";
import {
  getAccountMetaFactory as getAccountMetaFactory9,
  getAddressFromResolvedInstructionAccount as getAddressFromResolvedInstructionAccount9
} from "@solana/kit/program-client-core";
var INITIALIZE_PROTOCOL_DISCRIMINATOR = new Uint8Array([188, 233, 252, 106, 134, 146, 202, 91]);
function getInitializeProtocolDiscriminatorBytes() {
  return fixEncoderSize18(getBytesEncoder30(), 8).encode(
    INITIALIZE_PROTOCOL_DISCRIMINATOR
  );
}
function getInitializeProtocolInstructionDataEncoder() {
  return transformEncoder17(
    getStructEncoder19([
      ["discriminator", fixEncoderSize18(getBytesEncoder30(), 8)],
      ["policy", getListingPolicyEncoder()]
    ]),
    (value) => ({ ...value, discriminator: INITIALIZE_PROTOCOL_DISCRIMINATOR })
  );
}
function getInitializeProtocolInstructionDataDecoder() {
  return getStructDecoder19([
    ["discriminator", fixDecoderSize18(getBytesDecoder18(), 8)],
    ["policy", getListingPolicyDecoder()]
  ]);
}
function getInitializeProtocolInstructionDataCodec() {
  return combineCodec19(
    getInitializeProtocolInstructionDataEncoder(),
    getInitializeProtocolInstructionDataDecoder()
  );
}
async function getInitializeProtocolInstructionAsync(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory9(programAddress, "programId");
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
        admin: getAddressFromResolvedInstructionAccount9(
          "admin",
          accounts.admin.value
        )
      },
      { programAddress }
    );
  }
  if (!accounts.leverCurve.value) {
    accounts.leverCurve.value = await getProgramDerivedAddress13({
      programAddress: "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P",
      seeds: [
        getBytesEncoder30().encode(
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
        getAddressEncoder23().encode(
          getAddressFromResolvedInstructionAccount9(
            "leverMint",
            accounts.leverMint.value
          )
        )
      ]
    });
  }
  if (!accounts.quoteCurve.value) {
    accounts.quoteCurve.value = await getProgramDerivedAddress13({
      programAddress: "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P",
      seeds: [
        getBytesEncoder30().encode(
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
        getAddressEncoder23().encode(
          getAddressFromResolvedInstructionAccount9(
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
  const getAccountMeta = getAccountMetaFactory9(programAddress, "programId");
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
      admin: getNextAccount(),
      protocol: getNextAccount(),
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
  combineCodec as combineCodec20,
  fixDecoderSize as fixDecoderSize19,
  fixEncoderSize as fixEncoderSize19,
  getBytesDecoder as getBytesDecoder19,
  getBytesEncoder as getBytesEncoder31,
  getStructDecoder as getStructDecoder20,
  getStructEncoder as getStructEncoder20,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS10,
  SolanaError as SolanaError10,
  transformEncoder as transformEncoder18
} from "@solana/kit";
import {
  getAccountMetaFactory as getAccountMetaFactory10,
  getAddressFromResolvedInstructionAccount as getAddressFromResolvedInstructionAccount10
} from "@solana/kit/program-client-core";
var OPEN_MARGIN_ACCOUNT_DISCRIMINATOR = new Uint8Array([251, 54, 54, 233, 180, 125, 203, 107]);
function getOpenMarginAccountDiscriminatorBytes() {
  return fixEncoderSize19(getBytesEncoder31(), 8).encode(
    OPEN_MARGIN_ACCOUNT_DISCRIMINATOR
  );
}
function getOpenMarginAccountInstructionDataEncoder() {
  return transformEncoder18(
    getStructEncoder20([["discriminator", fixEncoderSize19(getBytesEncoder31(), 8)]]),
    (value) => ({ ...value, discriminator: OPEN_MARGIN_ACCOUNT_DISCRIMINATOR })
  );
}
function getOpenMarginAccountInstructionDataDecoder() {
  return getStructDecoder20([
    ["discriminator", fixDecoderSize19(getBytesDecoder19(), 8)]
  ]);
}
function getOpenMarginAccountInstructionDataCodec() {
  return combineCodec20(
    getOpenMarginAccountInstructionDataEncoder(),
    getOpenMarginAccountInstructionDataDecoder()
  );
}
async function getOpenMarginAccountInstructionAsync(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory10(programAddress, "programId");
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
        protocol: getAddressFromResolvedInstructionAccount10(
          "protocol",
          accounts.protocol.value
        ),
        owner: getAddressFromResolvedInstructionAccount10(
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
        margin: getAddressFromResolvedInstructionAccount10(
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
  const getAccountMeta = getAccountMetaFactory10(programAddress, "programId");
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
  combineCodec as combineCodec21,
  fixDecoderSize as fixDecoderSize20,
  fixEncoderSize as fixEncoderSize20,
  getBooleanDecoder as getBooleanDecoder7,
  getBooleanEncoder as getBooleanEncoder7,
  getBytesDecoder as getBytesDecoder20,
  getBytesEncoder as getBytesEncoder32,
  getStructDecoder as getStructDecoder21,
  getStructEncoder as getStructEncoder21,
  getU16Decoder as getU16Decoder3,
  getU16Encoder as getU16Encoder3,
  getU64Decoder as getU64Decoder13,
  getU64Encoder as getU64Encoder14,
  getU8Decoder as getU8Decoder9,
  getU8Encoder as getU8Encoder9,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS11,
  SolanaError as SolanaError11,
  transformEncoder as transformEncoder19
} from "@solana/kit";
import {
  getAccountMetaFactory as getAccountMetaFactory11,
  getAddressFromResolvedInstructionAccount as getAddressFromResolvedInstructionAccount11,
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
  return fixEncoderSize20(getBytesEncoder32(), 8).encode(
    OPEN_POSITION_DISCRIMINATOR
  );
}
function getOpenPositionInstructionDataEncoder() {
  return transformEncoder19(
    getStructEncoder21([
      ["discriminator", fixEncoderSize20(getBytesEncoder32(), 8)],
      ["id", getU64Encoder14()],
      ["collateral", getU64Encoder14()],
      ["leverage", getU8Encoder9()],
      ["long", getBooleanEncoder7()],
      ["expectedPrice", getU64Encoder14()],
      ["slippageBps", getU16Encoder3()]
    ]),
    (value) => ({ ...value, discriminator: OPEN_POSITION_DISCRIMINATOR })
  );
}
function getOpenPositionInstructionDataDecoder() {
  return getStructDecoder21([
    ["discriminator", fixDecoderSize20(getBytesDecoder20(), 8)],
    ["id", getU64Decoder13()],
    ["collateral", getU64Decoder13()],
    ["leverage", getU8Decoder9()],
    ["long", getBooleanDecoder7()],
    ["expectedPrice", getU64Decoder13()],
    ["slippageBps", getU16Decoder3()]
  ]);
}
function getOpenPositionInstructionDataCodec() {
  return combineCodec21(
    getOpenPositionInstructionDataEncoder(),
    getOpenPositionInstructionDataDecoder()
  );
}
async function getOpenPositionInstructionAsync(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory11(programAddress, "programId");
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
        listing: getAddressFromResolvedInstructionAccount11(
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
        protocol: getAddressFromResolvedInstructionAccount11(
          "protocol",
          accounts.protocol.value
        ),
        owner: getAddressFromResolvedInstructionAccount11(
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
        margin: getAddressFromResolvedInstructionAccount11(
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
        margin: getAddressFromResolvedInstructionAccount11(
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
        market: getAddressFromResolvedInstructionAccount11(
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
  const getAccountMeta = getAccountMetaFactory11(programAddress, "programId");
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
    throw new SolanaError11(
      SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS11,
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
  combineCodec as combineCodec22,
  fixDecoderSize as fixDecoderSize21,
  fixEncoderSize as fixEncoderSize21,
  getBytesDecoder as getBytesDecoder21,
  getBytesEncoder as getBytesEncoder33,
  getStructDecoder as getStructDecoder22,
  getStructEncoder as getStructEncoder22,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS12,
  SolanaError as SolanaError12,
  transformEncoder as transformEncoder20
} from "@solana/kit";
import {
  getAccountMetaFactory as getAccountMetaFactory12,
  getAddressFromResolvedInstructionAccount as getAddressFromResolvedInstructionAccount12
} from "@solana/kit/program-client-core";
var RECLAIM_AIRDROP_DISCRIMINATOR = new Uint8Array(
  [91, 136, 224, 68, 150, 221, 18, 207]
);
function getReclaimAirdropDiscriminatorBytes() {
  return fixEncoderSize21(getBytesEncoder33(), 8).encode(
    RECLAIM_AIRDROP_DISCRIMINATOR
  );
}
function getReclaimAirdropInstructionDataEncoder() {
  return transformEncoder20(
    getStructEncoder22([["discriminator", fixEncoderSize21(getBytesEncoder33(), 8)]]),
    (value) => ({ ...value, discriminator: RECLAIM_AIRDROP_DISCRIMINATOR })
  );
}
function getReclaimAirdropInstructionDataDecoder() {
  return getStructDecoder22([
    ["discriminator", fixDecoderSize21(getBytesDecoder21(), 8)]
  ]);
}
function getReclaimAirdropInstructionDataCodec() {
  return combineCodec22(
    getReclaimAirdropInstructionDataEncoder(),
    getReclaimAirdropInstructionDataDecoder()
  );
}
async function getReclaimAirdropInstructionAsync(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory12(programAddress, "programId");
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
        protocol: getAddressFromResolvedInstructionAccount12(
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
        campaign: getAddressFromResolvedInstructionAccount12(
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
  const getAccountMeta = getAccountMetaFactory12(programAddress, "programId");
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
    throw new SolanaError12(
      SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS12,
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
  combineCodec as combineCodec23,
  fixDecoderSize as fixDecoderSize22,
  fixEncoderSize as fixEncoderSize22,
  getBytesDecoder as getBytesDecoder22,
  getBytesEncoder as getBytesEncoder34,
  getStructDecoder as getStructDecoder23,
  getStructEncoder as getStructEncoder23,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS13,
  SolanaError as SolanaError13,
  transformEncoder as transformEncoder21
} from "@solana/kit";
import {
  getAccountMetaFactory as getAccountMetaFactory13
} from "@solana/kit/program-client-core";
var REFRESH_MARKET_PRICE_DISCRIMINATOR = new Uint8Array([66, 92, 186, 127, 188, 0, 23, 207]);
function getRefreshMarketPriceDiscriminatorBytes() {
  return fixEncoderSize22(getBytesEncoder34(), 8).encode(
    REFRESH_MARKET_PRICE_DISCRIMINATOR
  );
}
function getRefreshMarketPriceInstructionDataEncoder() {
  return transformEncoder21(
    getStructEncoder23([["discriminator", fixEncoderSize22(getBytesEncoder34(), 8)]]),
    (value) => ({
      ...value,
      discriminator: REFRESH_MARKET_PRICE_DISCRIMINATOR
    })
  );
}
function getRefreshMarketPriceInstructionDataDecoder() {
  return getStructDecoder23([
    ["discriminator", fixDecoderSize22(getBytesDecoder22(), 8)]
  ]);
}
function getRefreshMarketPriceInstructionDataCodec() {
  return combineCodec23(
    getRefreshMarketPriceInstructionDataEncoder(),
    getRefreshMarketPriceInstructionDataDecoder()
  );
}
function getRefreshMarketPriceInstruction(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory13(programAddress, "programId");
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
    throw new SolanaError13(
      SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS13,
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
  combineCodec as combineCodec24,
  fixDecoderSize as fixDecoderSize23,
  fixEncoderSize as fixEncoderSize23,
  getAddressEncoder as getAddressEncoder24,
  getBytesDecoder as getBytesDecoder23,
  getBytesEncoder as getBytesEncoder35,
  getProgramDerivedAddress as getProgramDerivedAddress14,
  getStructDecoder as getStructDecoder24,
  getStructEncoder as getStructEncoder24,
  getU64Decoder as getU64Decoder14,
  getU64Encoder as getU64Encoder15,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS14,
  SolanaError as SolanaError14,
  transformEncoder as transformEncoder22
} from "@solana/kit";
import {
  getAccountMetaFactory as getAccountMetaFactory14,
  getAddressFromResolvedInstructionAccount as getAddressFromResolvedInstructionAccount13
} from "@solana/kit/program-client-core";
var REQUEST_LISTING_DISCRIMINATOR = new Uint8Array(
  [2, 167, 98, 66, 122, 255, 254, 216]
);
function getRequestListingDiscriminatorBytes() {
  return fixEncoderSize23(getBytesEncoder35(), 8).encode(
    REQUEST_LISTING_DISCRIMINATOR
  );
}
function getRequestListingInstructionDataEncoder() {
  return transformEncoder22(
    getStructEncoder24([
      ["discriminator", fixEncoderSize23(getBytesEncoder35(), 8)],
      ["solLamports", getU64Encoder15()],
      ["tokenAmount", getU64Encoder15()]
    ]),
    (value) => ({ ...value, discriminator: REQUEST_LISTING_DISCRIMINATOR })
  );
}
function getRequestListingInstructionDataDecoder() {
  return getStructDecoder24([
    ["discriminator", fixDecoderSize23(getBytesDecoder23(), 8)],
    ["solLamports", getU64Decoder14()],
    ["tokenAmount", getU64Decoder14()]
  ]);
}
function getRequestListingInstructionDataCodec() {
  return combineCodec24(
    getRequestListingInstructionDataEncoder(),
    getRequestListingInstructionDataDecoder()
  );
}
async function getRequestListingInstructionAsync(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory14(programAddress, "programId");
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
        protocol: getAddressFromResolvedInstructionAccount13(
          "protocol",
          accounts.protocol.value
        ),
        baseMint: getAddressFromResolvedInstructionAccount13(
          "baseMint",
          accounts.baseMint.value
        ),
        lister: getAddressFromResolvedInstructionAccount13(
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
        protocol: getAddressFromResolvedInstructionAccount13(
          "protocol",
          accounts.protocol.value
        ),
        baseMint: getAddressFromResolvedInstructionAccount13(
          "baseMint",
          accounts.baseMint.value
        )
      },
      { programAddress }
    );
  }
  if (!accounts.pumpCurve.value) {
    accounts.pumpCurve.value = await getProgramDerivedAddress14({
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
        getAddressEncoder24().encode(
          getAddressFromResolvedInstructionAccount13(
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
        listing: getAddressFromResolvedInstructionAccount13(
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
  const getAccountMeta = getAccountMetaFactory14(programAddress, "programId");
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
    throw new SolanaError14(
      SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS14,
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
  combineCodec as combineCodec25,
  fixDecoderSize as fixDecoderSize24,
  fixEncoderSize as fixEncoderSize24,
  getBytesDecoder as getBytesDecoder24,
  getBytesEncoder as getBytesEncoder36,
  getStructDecoder as getStructDecoder25,
  getStructEncoder as getStructEncoder25,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS15,
  SolanaError as SolanaError15,
  transformEncoder as transformEncoder23
} from "@solana/kit";
import {
  getAccountMetaFactory as getAccountMetaFactory15,
  getAddressFromResolvedInstructionAccount as getAddressFromResolvedInstructionAccount14
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
  return fixEncoderSize24(getBytesEncoder36(), 8).encode(
    RETIRE_MARKET_DISCRIMINATOR
  );
}
function getRetireMarketInstructionDataEncoder() {
  return transformEncoder23(
    getStructEncoder25([["discriminator", fixEncoderSize24(getBytesEncoder36(), 8)]]),
    (value) => ({ ...value, discriminator: RETIRE_MARKET_DISCRIMINATOR })
  );
}
function getRetireMarketInstructionDataDecoder() {
  return getStructDecoder25([
    ["discriminator", fixDecoderSize24(getBytesDecoder24(), 8)]
  ]);
}
function getRetireMarketInstructionDataCodec() {
  return combineCodec25(
    getRetireMarketInstructionDataEncoder(),
    getRetireMarketInstructionDataDecoder()
  );
}
async function getRetireMarketInstructionAsync(input, config) {
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
        admin: getAddressFromResolvedInstructionAccount14(
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
        listing: getAddressFromResolvedInstructionAccount14(
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
  const getAccountMeta = getAccountMetaFactory15(programAddress, "programId");
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
    throw new SolanaError15(
      SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS15,
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
  combineCodec as combineCodec26,
  fixDecoderSize as fixDecoderSize25,
  fixEncoderSize as fixEncoderSize25,
  getBytesDecoder as getBytesDecoder25,
  getBytesEncoder as getBytesEncoder37,
  getStructDecoder as getStructDecoder26,
  getStructEncoder as getStructEncoder26,
  getU64Decoder as getU64Decoder15,
  getU64Encoder as getU64Encoder16,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS16,
  SolanaError as SolanaError16,
  transformEncoder as transformEncoder24
} from "@solana/kit";
import {
  getAccountMetaFactory as getAccountMetaFactory16
} from "@solana/kit/program-client-core";
var ROUTE_PLATFORM_REVENUE_DISCRIMINATOR = new Uint8Array([72, 200, 22, 148, 177, 183, 136, 29]);
function getRoutePlatformRevenueDiscriminatorBytes() {
  return fixEncoderSize25(getBytesEncoder37(), 8).encode(
    ROUTE_PLATFORM_REVENUE_DISCRIMINATOR
  );
}
function getRoutePlatformRevenueInstructionDataEncoder() {
  return transformEncoder24(
    getStructEncoder26([
      ["discriminator", fixEncoderSize25(getBytesEncoder37(), 8)],
      ["amount", getU64Encoder16()]
    ]),
    (value) => ({
      ...value,
      discriminator: ROUTE_PLATFORM_REVENUE_DISCRIMINATOR
    })
  );
}
function getRoutePlatformRevenueInstructionDataDecoder() {
  return getStructDecoder26([
    ["discriminator", fixDecoderSize25(getBytesDecoder25(), 8)],
    ["amount", getU64Decoder15()]
  ]);
}
function getRoutePlatformRevenueInstructionDataCodec() {
  return combineCodec26(
    getRoutePlatformRevenueInstructionDataEncoder(),
    getRoutePlatformRevenueInstructionDataDecoder()
  );
}
function getRoutePlatformRevenueInstruction(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory16(programAddress, "programId");
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
    throw new SolanaError16(
      SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS16,
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
  combineCodec as combineCodec27,
  fixDecoderSize as fixDecoderSize26,
  fixEncoderSize as fixEncoderSize26,
  getBytesDecoder as getBytesDecoder26,
  getBytesEncoder as getBytesEncoder38,
  getStructDecoder as getStructDecoder27,
  getStructEncoder as getStructEncoder27,
  getU64Decoder as getU64Decoder16,
  getU64Encoder as getU64Encoder17,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS17,
  SolanaError as SolanaError17,
  transformEncoder as transformEncoder25
} from "@solana/kit";
import {
  getAccountMetaFactory as getAccountMetaFactory17
} from "@solana/kit/program-client-core";
var ROUTE_TOKEN_CREATOR_REVENUE_DISCRIMINATOR = new Uint8Array([248, 247, 236, 188, 45, 130, 117, 221]);
function getRouteTokenCreatorRevenueDiscriminatorBytes() {
  return fixEncoderSize26(getBytesEncoder38(), 8).encode(
    ROUTE_TOKEN_CREATOR_REVENUE_DISCRIMINATOR
  );
}
function getRouteTokenCreatorRevenueInstructionDataEncoder() {
  return transformEncoder25(
    getStructEncoder27([
      ["discriminator", fixEncoderSize26(getBytesEncoder38(), 8)],
      ["amount", getU64Encoder17()]
    ]),
    (value) => ({
      ...value,
      discriminator: ROUTE_TOKEN_CREATOR_REVENUE_DISCRIMINATOR
    })
  );
}
function getRouteTokenCreatorRevenueInstructionDataDecoder() {
  return getStructDecoder27([
    ["discriminator", fixDecoderSize26(getBytesDecoder26(), 8)],
    ["amount", getU64Decoder16()]
  ]);
}
function getRouteTokenCreatorRevenueInstructionDataCodec() {
  return combineCodec27(
    getRouteTokenCreatorRevenueInstructionDataEncoder(),
    getRouteTokenCreatorRevenueInstructionDataDecoder()
  );
}
function getRouteTokenCreatorRevenueInstruction(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory17(programAddress, "programId");
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
    throw new SolanaError17(
      SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS17,
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
  combineCodec as combineCodec28,
  fixDecoderSize as fixDecoderSize27,
  fixEncoderSize as fixEncoderSize27,
  getBooleanDecoder as getBooleanDecoder8,
  getBooleanEncoder as getBooleanEncoder8,
  getBytesDecoder as getBytesDecoder27,
  getBytesEncoder as getBytesEncoder39,
  getStructDecoder as getStructDecoder28,
  getStructEncoder as getStructEncoder28,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS18,
  SolanaError as SolanaError18,
  transformEncoder as transformEncoder26
} from "@solana/kit";
import {
  getAccountMetaFactory as getAccountMetaFactory18
} from "@solana/kit/program-client-core";
var SET_LISTING_APPROVED_DISCRIMINATOR = new Uint8Array([199, 59, 208, 95, 38, 69, 168, 183]);
function getSetListingApprovedDiscriminatorBytes() {
  return fixEncoderSize27(getBytesEncoder39(), 8).encode(
    SET_LISTING_APPROVED_DISCRIMINATOR
  );
}
function getSetListingApprovedInstructionDataEncoder() {
  return transformEncoder26(
    getStructEncoder28([
      ["discriminator", fixEncoderSize27(getBytesEncoder39(), 8)],
      ["approved", getBooleanEncoder8()]
    ]),
    (value) => ({
      ...value,
      discriminator: SET_LISTING_APPROVED_DISCRIMINATOR
    })
  );
}
function getSetListingApprovedInstructionDataDecoder() {
  return getStructDecoder28([
    ["discriminator", fixDecoderSize27(getBytesDecoder27(), 8)],
    ["approved", getBooleanDecoder8()]
  ]);
}
function getSetListingApprovedInstructionDataCodec() {
  return combineCodec28(
    getSetListingApprovedInstructionDataEncoder(),
    getSetListingApprovedInstructionDataDecoder()
  );
}
function getSetListingApprovedInstruction(input, config) {
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
    throw new SolanaError18(
      SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS18,
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
  combineCodec as combineCodec29,
  fixDecoderSize as fixDecoderSize28,
  fixEncoderSize as fixEncoderSize28,
  getBytesDecoder as getBytesDecoder28,
  getBytesEncoder as getBytesEncoder40,
  getI64Decoder as getI64Decoder8,
  getI64Encoder as getI64Encoder8,
  getStructDecoder as getStructDecoder29,
  getStructEncoder as getStructEncoder29,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS19,
  SolanaError as SolanaError19,
  transformEncoder as transformEncoder27
} from "@solana/kit";
import {
  getAccountMetaFactory as getAccountMetaFactory19,
  getAddressFromResolvedInstructionAccount as getAddressFromResolvedInstructionAccount15
} from "@solana/kit/program-client-core";
var SET_LISTING_PERMIT_EXPIRY_DISCRIMINATOR = new Uint8Array([211, 65, 230, 231, 156, 48, 13, 25]);
function getSetListingPermitExpiryDiscriminatorBytes() {
  return fixEncoderSize28(getBytesEncoder40(), 8).encode(
    SET_LISTING_PERMIT_EXPIRY_DISCRIMINATOR
  );
}
function getSetListingPermitExpiryInstructionDataEncoder() {
  return transformEncoder27(
    getStructEncoder29([
      ["discriminator", fixEncoderSize28(getBytesEncoder40(), 8)],
      ["expiresAt", getI64Encoder8()]
    ]),
    (value) => ({
      ...value,
      discriminator: SET_LISTING_PERMIT_EXPIRY_DISCRIMINATOR
    })
  );
}
function getSetListingPermitExpiryInstructionDataDecoder() {
  return getStructDecoder29([
    ["discriminator", fixDecoderSize28(getBytesDecoder28(), 8)],
    ["expiresAt", getI64Decoder8()]
  ]);
}
function getSetListingPermitExpiryInstructionDataCodec() {
  return combineCodec29(
    getSetListingPermitExpiryInstructionDataEncoder(),
    getSetListingPermitExpiryInstructionDataDecoder()
  );
}
async function getSetListingPermitExpiryInstructionAsync(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory19(programAddress, "programId");
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
        admin: getAddressFromResolvedInstructionAccount15(
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
  const getAccountMeta = getAccountMetaFactory19(programAddress, "programId");
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
    throw new SolanaError19(
      SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS19,
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
  combineCodec as combineCodec30,
  fixDecoderSize as fixDecoderSize29,
  fixEncoderSize as fixEncoderSize29,
  getBooleanDecoder as getBooleanDecoder9,
  getBooleanEncoder as getBooleanEncoder9,
  getBytesDecoder as getBytesDecoder29,
  getBytesEncoder as getBytesEncoder41,
  getStructDecoder as getStructDecoder30,
  getStructEncoder as getStructEncoder30,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS20,
  SolanaError as SolanaError20,
  transformEncoder as transformEncoder28
} from "@solana/kit";
import {
  getAccountMetaFactory as getAccountMetaFactory20,
  getAddressFromResolvedInstructionAccount as getAddressFromResolvedInstructionAccount16
} from "@solana/kit/program-client-core";
var SET_MARKET_ENABLED_DISCRIMINATOR = new Uint8Array([206, 60, 159, 159, 62, 242, 4, 82]);
function getSetMarketEnabledDiscriminatorBytes() {
  return fixEncoderSize29(getBytesEncoder41(), 8).encode(
    SET_MARKET_ENABLED_DISCRIMINATOR
  );
}
function getSetMarketEnabledInstructionDataEncoder() {
  return transformEncoder28(
    getStructEncoder30([
      ["discriminator", fixEncoderSize29(getBytesEncoder41(), 8)],
      ["enabled", getBooleanEncoder9()]
    ]),
    (value) => ({ ...value, discriminator: SET_MARKET_ENABLED_DISCRIMINATOR })
  );
}
function getSetMarketEnabledInstructionDataDecoder() {
  return getStructDecoder30([
    ["discriminator", fixDecoderSize29(getBytesDecoder29(), 8)],
    ["enabled", getBooleanDecoder9()]
  ]);
}
function getSetMarketEnabledInstructionDataCodec() {
  return combineCodec30(
    getSetMarketEnabledInstructionDataEncoder(),
    getSetMarketEnabledInstructionDataDecoder()
  );
}
async function getSetMarketEnabledInstructionAsync(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory20(programAddress, "programId");
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
        admin: getAddressFromResolvedInstructionAccount16(
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
        listing: getAddressFromResolvedInstructionAccount16(
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
  const getAccountMeta = getAccountMetaFactory20(programAddress, "programId");
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
    throw new SolanaError20(
      SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS20,
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
  combineCodec as combineCodec31,
  fixDecoderSize as fixDecoderSize30,
  fixEncoderSize as fixEncoderSize30,
  getBooleanDecoder as getBooleanDecoder10,
  getBooleanEncoder as getBooleanEncoder10,
  getBytesDecoder as getBytesDecoder30,
  getBytesEncoder as getBytesEncoder42,
  getStructDecoder as getStructDecoder31,
  getStructEncoder as getStructEncoder31,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS21,
  SolanaError as SolanaError21,
  transformEncoder as transformEncoder29
} from "@solana/kit";
import {
  getAccountMetaFactory as getAccountMetaFactory21
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
  return fixEncoderSize30(getBytesEncoder42(), 8).encode(SET_PAUSED_DISCRIMINATOR);
}
function getSetPausedInstructionDataEncoder() {
  return transformEncoder29(
    getStructEncoder31([
      ["discriminator", fixEncoderSize30(getBytesEncoder42(), 8)],
      ["paused", getBooleanEncoder10()]
    ]),
    (value) => ({ ...value, discriminator: SET_PAUSED_DISCRIMINATOR })
  );
}
function getSetPausedInstructionDataDecoder() {
  return getStructDecoder31([
    ["discriminator", fixDecoderSize30(getBytesDecoder30(), 8)],
    ["paused", getBooleanDecoder10()]
  ]);
}
function getSetPausedInstructionDataCodec() {
  return combineCodec31(
    getSetPausedInstructionDataEncoder(),
    getSetPausedInstructionDataDecoder()
  );
}
function getSetPausedInstruction(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory21(programAddress, "programId");
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
    throw new SolanaError21(
      SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS21,
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
  combineCodec as combineCodec32,
  fixDecoderSize as fixDecoderSize31,
  fixEncoderSize as fixEncoderSize31,
  getBytesDecoder as getBytesDecoder31,
  getBytesEncoder as getBytesEncoder43,
  getStructDecoder as getStructDecoder32,
  getStructEncoder as getStructEncoder32,
  getU16Decoder as getU16Decoder4,
  getU16Encoder as getU16Encoder4,
  getU64Decoder as getU64Decoder17,
  getU64Encoder as getU64Encoder18,
  getU8Decoder as getU8Decoder10,
  getU8Encoder as getU8Encoder10,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS22,
  SolanaError as SolanaError22,
  transformEncoder as transformEncoder30
} from "@solana/kit";
import {
  getAccountMetaFactory as getAccountMetaFactory22,
  getAddressFromResolvedInstructionAccount as getAddressFromResolvedInstructionAccount17
} from "@solana/kit/program-client-core";
var SETTLE_POSITION_DISCRIMINATOR = new Uint8Array(
  [33, 156, 74, 218, 215, 42, 112, 175]
);
function getSettlePositionDiscriminatorBytes() {
  return fixEncoderSize31(getBytesEncoder43(), 8).encode(
    SETTLE_POSITION_DISCRIMINATOR
  );
}
function getSettlePositionInstructionDataEncoder() {
  return transformEncoder30(
    getStructEncoder32([
      ["discriminator", fixEncoderSize31(getBytesEncoder43(), 8)],
      ["reason", getU8Encoder10()],
      ["expectedPrice", getU64Encoder18()],
      ["slippageBps", getU16Encoder4()]
    ]),
    (value) => ({ ...value, discriminator: SETTLE_POSITION_DISCRIMINATOR })
  );
}
function getSettlePositionInstructionDataDecoder() {
  return getStructDecoder32([
    ["discriminator", fixDecoderSize31(getBytesDecoder31(), 8)],
    ["reason", getU8Decoder10()],
    ["expectedPrice", getU64Decoder17()],
    ["slippageBps", getU16Decoder4()]
  ]);
}
function getSettlePositionInstructionDataCodec() {
  return combineCodec32(
    getSettlePositionInstructionDataEncoder(),
    getSettlePositionInstructionDataDecoder()
  );
}
async function getSettlePositionInstructionAsync(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory22(programAddress, "programId");
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
        margin: getAddressFromResolvedInstructionAccount17(
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
        market: getAddressFromResolvedInstructionAccount17(
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
  const getAccountMeta = getAccountMetaFactory22(programAddress, "programId");
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
    throw new SolanaError22(
      SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS22,
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
  combineCodec as combineCodec33,
  fixDecoderSize as fixDecoderSize32,
  fixEncoderSize as fixEncoderSize32,
  getBytesDecoder as getBytesDecoder32,
  getBytesEncoder as getBytesEncoder44,
  getStructDecoder as getStructDecoder33,
  getStructEncoder as getStructEncoder33,
  getU64Decoder as getU64Decoder18,
  getU64Encoder as getU64Encoder19,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS23,
  SolanaError as SolanaError23,
  transformEncoder as transformEncoder31
} from "@solana/kit";
import {
  getAccountMetaFactory as getAccountMetaFactory23,
  getAddressFromResolvedInstructionAccount as getAddressFromResolvedInstructionAccount18
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
  return fixEncoderSize32(getBytesEncoder44(), 8).encode(WITHDRAW_DISCRIMINATOR);
}
function getWithdrawInstructionDataEncoder() {
  return transformEncoder31(
    getStructEncoder33([
      ["discriminator", fixEncoderSize32(getBytesEncoder44(), 8)],
      ["amount", getU64Encoder19()]
    ]),
    (value) => ({ ...value, discriminator: WITHDRAW_DISCRIMINATOR })
  );
}
function getWithdrawInstructionDataDecoder() {
  return getStructDecoder33([
    ["discriminator", fixDecoderSize32(getBytesDecoder32(), 8)],
    ["amount", getU64Decoder18()]
  ]);
}
function getWithdrawInstructionDataCodec() {
  return combineCodec33(
    getWithdrawInstructionDataEncoder(),
    getWithdrawInstructionDataDecoder()
  );
}
async function getWithdrawInstructionAsync(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory23(programAddress, "programId");
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
        protocol: getAddressFromResolvedInstructionAccount18(
          "protocol",
          accounts.protocol.value
        ),
        owner: getAddressFromResolvedInstructionAccount18(
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
        margin: getAddressFromResolvedInstructionAccount18(
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
  const getAccountMeta = getAccountMetaFactory23(programAddress, "programId");
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
    throw new SolanaError23(
      SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS23,
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
  combineCodec as combineCodec34,
  fixDecoderSize as fixDecoderSize33,
  fixEncoderSize as fixEncoderSize33,
  getBytesDecoder as getBytesDecoder33,
  getBytesEncoder as getBytesEncoder45,
  getStructDecoder as getStructDecoder34,
  getStructEncoder as getStructEncoder34,
  getU64Decoder as getU64Decoder19,
  getU64Encoder as getU64Encoder20,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS24,
  SolanaError as SolanaError24,
  transformEncoder as transformEncoder32
} from "@solana/kit";
import {
  getAccountMetaFactory as getAccountMetaFactory24,
  getAddressFromResolvedInstructionAccount as getAddressFromResolvedInstructionAccount19
} from "@solana/kit/program-client-core";
var WITHDRAW_MARKET_LIQUIDITY_DISCRIMINATOR = new Uint8Array([151, 228, 127, 80, 156, 209, 76, 82]);
function getWithdrawMarketLiquidityDiscriminatorBytes() {
  return fixEncoderSize33(getBytesEncoder45(), 8).encode(
    WITHDRAW_MARKET_LIQUIDITY_DISCRIMINATOR
  );
}
function getWithdrawMarketLiquidityInstructionDataEncoder() {
  return transformEncoder32(
    getStructEncoder34([
      ["discriminator", fixEncoderSize33(getBytesEncoder45(), 8)],
      ["amount", getU64Encoder20()]
    ]),
    (value) => ({
      ...value,
      discriminator: WITHDRAW_MARKET_LIQUIDITY_DISCRIMINATOR
    })
  );
}
function getWithdrawMarketLiquidityInstructionDataDecoder() {
  return getStructDecoder34([
    ["discriminator", fixDecoderSize33(getBytesDecoder33(), 8)],
    ["amount", getU64Decoder19()]
  ]);
}
function getWithdrawMarketLiquidityInstructionDataCodec() {
  return combineCodec34(
    getWithdrawMarketLiquidityInstructionDataEncoder(),
    getWithdrawMarketLiquidityInstructionDataDecoder()
  );
}
async function getWithdrawMarketLiquidityInstructionAsync(input, config) {
  const programAddressInput = config?.programAddress ?? LEVERMEME_PROGRAM_ADDRESS;
  const programAddress = typeof programAddressInput === "string" ? programAddressInput : programAddressInput.address;
  const getAccountMeta = getAccountMetaFactory24(programAddress, "programId");
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
        market: getAddressFromResolvedInstructionAccount19(
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
  const getAccountMeta = getAccountMetaFactory24(programAddress, "programId");
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
    throw new SolanaError24(
      SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS24,
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
  return LevermemeAccount2;
})(LevermemeAccount || {});
function identifyLevermemeAccount(account) {
  const data = "data" in account ? account.data : account;
  if (containsBytes(
    data,
    fixEncoderSize34(getBytesEncoder46(), 8).encode(
      new Uint8Array([235, 102, 51, 70, 37, 179, 248, 13])
    ),
    0
  )) {
    return 0 /* AirdropCampaign */;
  }
  if (containsBytes(
    data,
    fixEncoderSize34(getBytesEncoder46(), 8).encode(
      new Uint8Array([231, 12, 74, 54, 245, 181, 248, 38])
    ),
    0
  )) {
    return 1 /* AirdropClaim */;
  }
  if (containsBytes(
    data,
    fixEncoderSize34(getBytesEncoder46(), 8).encode(
      new Uint8Array([218, 32, 50, 73, 43, 134, 26, 58])
    ),
    0
  )) {
    return 2 /* Listing */;
  }
  if (containsBytes(
    data,
    fixEncoderSize34(getBytesEncoder46(), 8).encode(
      new Uint8Array([117, 63, 230, 146, 238, 62, 186, 162])
    ),
    0
  )) {
    return 3 /* ListingPermit */;
  }
  if (containsBytes(
    data,
    fixEncoderSize34(getBytesEncoder46(), 8).encode(
      new Uint8Array([133, 220, 173, 213, 179, 211, 43, 238])
    ),
    0
  )) {
    return 4 /* MarginAccount */;
  }
  if (containsBytes(
    data,
    fixEncoderSize34(getBytesEncoder46(), 8).encode(
      new Uint8Array([219, 190, 213, 55, 0, 227, 198, 154])
    ),
    0
  )) {
    return 5 /* Market */;
  }
  if (containsBytes(
    data,
    fixEncoderSize34(getBytesEncoder46(), 8).encode(
      new Uint8Array([170, 188, 143, 228, 122, 64, 247, 208])
    ),
    0
  )) {
    return 6 /* Position */;
  }
  if (containsBytes(
    data,
    fixEncoderSize34(getBytesEncoder46(), 8).encode(
      new Uint8Array([45, 39, 101, 43, 115, 72, 131, 40])
    ),
    0
  )) {
    return 7 /* Protocol */;
  }
  throw new SolanaError25(
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
  LevermemeEvent2[LevermemeEvent2["PositionOpened"] = 7] = "PositionOpened";
  LevermemeEvent2[LevermemeEvent2["PositionSettled"] = 8] = "PositionSettled";
  LevermemeEvent2[LevermemeEvent2["PriceRefreshed"] = 9] = "PriceRefreshed";
  LevermemeEvent2[LevermemeEvent2["ProtocolCreated"] = 10] = "ProtocolCreated";
  LevermemeEvent2[LevermemeEvent2["RevenueRouted"] = 11] = "RevenueRouted";
  return LevermemeEvent2;
})(LevermemeEvent || {});
function identifyLevermemeEvent(event) {
  const data = "data" in event ? event.data : event;
  if (containsBytes(
    data,
    fixEncoderSize34(getBytesEncoder46(), 8).encode(
      new Uint8Array([125, 251, 195, 183, 202, 126, 89, 68])
    ),
    0
  )) {
    return 0 /* AirdropClaimed */;
  }
  if (containsBytes(
    data,
    fixEncoderSize34(getBytesEncoder46(), 8).encode(
      new Uint8Array([190, 219, 101, 33, 208, 187, 149, 96])
    ),
    0
  )) {
    return 1 /* AirdropCreated */;
  }
  if (containsBytes(
    data,
    fixEncoderSize34(getBytesEncoder46(), 8).encode(
      new Uint8Array([172, 114, 48, 57, 98, 83, 95, 157])
    ),
    0
  )) {
    return 2 /* CollateralChanged */;
  }
  if (containsBytes(
    data,
    fixEncoderSize34(getBytesEncoder46(), 8).encode(
      new Uint8Array([11, 46, 163, 10, 103, 80, 139, 194])
    ),
    0
  )) {
    return 3 /* ListingCancelled */;
  }
  if (containsBytes(
    data,
    fixEncoderSize34(getBytesEncoder46(), 8).encode(
      new Uint8Array([150, 236, 30, 166, 150, 162, 210, 167])
    ),
    0
  )) {
    return 4 /* ListingRequested */;
  }
  if (containsBytes(
    data,
    fixEncoderSize34(getBytesEncoder46(), 8).encode(
      new Uint8Array([33, 226, 137, 167, 158, 100, 9, 238])
    ),
    0
  )) {
    return 5 /* ListingReviewed */;
  }
  if (containsBytes(
    data,
    fixEncoderSize34(getBytesEncoder46(), 8).encode(
      new Uint8Array([238, 188, 213, 78, 134, 209, 178, 218])
    ),
    0
  )) {
    return 6 /* PauseChanged */;
  }
  if (containsBytes(
    data,
    fixEncoderSize34(getBytesEncoder46(), 8).encode(
      new Uint8Array([237, 175, 243, 230, 147, 117, 101, 121])
    ),
    0
  )) {
    return 7 /* PositionOpened */;
  }
  if (containsBytes(
    data,
    fixEncoderSize34(getBytesEncoder46(), 8).encode(
      new Uint8Array([75, 100, 92, 189, 245, 116, 252, 221])
    ),
    0
  )) {
    return 8 /* PositionSettled */;
  }
  if (containsBytes(
    data,
    fixEncoderSize34(getBytesEncoder46(), 8).encode(
      new Uint8Array([64, 39, 28, 72, 53, 221, 84, 139])
    ),
    0
  )) {
    return 9 /* PriceRefreshed */;
  }
  if (containsBytes(
    data,
    fixEncoderSize34(getBytesEncoder46(), 8).encode(
      new Uint8Array([15, 251, 247, 158, 97, 201, 1, 226])
    ),
    0
  )) {
    return 10 /* ProtocolCreated */;
  }
  if (containsBytes(
    data,
    fixEncoderSize34(getBytesEncoder46(), 8).encode(
      new Uint8Array([57, 95, 242, 242, 222, 199, 192, 120])
    ),
    0
  )) {
    return 11 /* RevenueRouted */;
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
  LevermemeInstruction2[LevermemeInstruction2["CreateAirdrop"] = 4] = "CreateAirdrop";
  LevermemeInstruction2[LevermemeInstruction2["CreateMarket"] = 5] = "CreateMarket";
  LevermemeInstruction2[LevermemeInstruction2["Deposit"] = 6] = "Deposit";
  LevermemeInstruction2[LevermemeInstruction2["FundMarket"] = 7] = "FundMarket";
  LevermemeInstruction2[LevermemeInstruction2["InitializeProtocol"] = 8] = "InitializeProtocol";
  LevermemeInstruction2[LevermemeInstruction2["OpenMarginAccount"] = 9] = "OpenMarginAccount";
  LevermemeInstruction2[LevermemeInstruction2["OpenPosition"] = 10] = "OpenPosition";
  LevermemeInstruction2[LevermemeInstruction2["ReclaimAirdrop"] = 11] = "ReclaimAirdrop";
  LevermemeInstruction2[LevermemeInstruction2["RefreshMarketPrice"] = 12] = "RefreshMarketPrice";
  LevermemeInstruction2[LevermemeInstruction2["RequestListing"] = 13] = "RequestListing";
  LevermemeInstruction2[LevermemeInstruction2["RetireMarket"] = 14] = "RetireMarket";
  LevermemeInstruction2[LevermemeInstruction2["RoutePlatformRevenue"] = 15] = "RoutePlatformRevenue";
  LevermemeInstruction2[LevermemeInstruction2["RouteTokenCreatorRevenue"] = 16] = "RouteTokenCreatorRevenue";
  LevermemeInstruction2[LevermemeInstruction2["SetListingApproved"] = 17] = "SetListingApproved";
  LevermemeInstruction2[LevermemeInstruction2["SetListingPermitExpiry"] = 18] = "SetListingPermitExpiry";
  LevermemeInstruction2[LevermemeInstruction2["SetMarketEnabled"] = 19] = "SetMarketEnabled";
  LevermemeInstruction2[LevermemeInstruction2["SetPaused"] = 20] = "SetPaused";
  LevermemeInstruction2[LevermemeInstruction2["SettlePosition"] = 21] = "SettlePosition";
  LevermemeInstruction2[LevermemeInstruction2["Withdraw"] = 22] = "Withdraw";
  LevermemeInstruction2[LevermemeInstruction2["WithdrawMarketLiquidity"] = 23] = "WithdrawMarketLiquidity";
  return LevermemeInstruction2;
})(LevermemeInstruction || {});
function identifyLevermemeInstruction(instruction) {
  const data = "data" in instruction ? instruction.data : instruction;
  if (containsBytes(
    data,
    fixEncoderSize34(getBytesEncoder46(), 8).encode(
      new Uint8Array([155, 67, 86, 117, 115, 161, 112, 127])
    ),
    0
  )) {
    return 0 /* ApproveListingPermit */;
  }
  if (containsBytes(
    data,
    fixEncoderSize34(getBytesEncoder46(), 8).encode(
      new Uint8Array([41, 183, 50, 232, 230, 233, 157, 70])
    ),
    0
  )) {
    return 1 /* CancelListing */;
  }
  if (containsBytes(
    data,
    fixEncoderSize34(getBytesEncoder46(), 8).encode(
      new Uint8Array([137, 50, 122, 111, 89, 254, 8, 20])
    ),
    0
  )) {
    return 2 /* ClaimAirdrop */;
  }
  if (containsBytes(
    data,
    fixEncoderSize34(getBytesEncoder46(), 8).encode(
      new Uint8Array([91, 210, 175, 55, 51, 117, 137, 238])
    ),
    0
  )) {
    return 3 /* CollectMarketFees */;
  }
  if (containsBytes(
    data,
    fixEncoderSize34(getBytesEncoder46(), 8).encode(
      new Uint8Array([227, 135, 208, 66, 137, 177, 80, 94])
    ),
    0
  )) {
    return 4 /* CreateAirdrop */;
  }
  if (containsBytes(
    data,
    fixEncoderSize34(getBytesEncoder46(), 8).encode(
      new Uint8Array([103, 226, 97, 235, 200, 188, 251, 254])
    ),
    0
  )) {
    return 5 /* CreateMarket */;
  }
  if (containsBytes(
    data,
    fixEncoderSize34(getBytesEncoder46(), 8).encode(
      new Uint8Array([242, 35, 198, 137, 82, 225, 242, 182])
    ),
    0
  )) {
    return 6 /* Deposit */;
  }
  if (containsBytes(
    data,
    fixEncoderSize34(getBytesEncoder46(), 8).encode(
      new Uint8Array([173, 177, 32, 57, 20, 248, 119, 160])
    ),
    0
  )) {
    return 7 /* FundMarket */;
  }
  if (containsBytes(
    data,
    fixEncoderSize34(getBytesEncoder46(), 8).encode(
      new Uint8Array([188, 233, 252, 106, 134, 146, 202, 91])
    ),
    0
  )) {
    return 8 /* InitializeProtocol */;
  }
  if (containsBytes(
    data,
    fixEncoderSize34(getBytesEncoder46(), 8).encode(
      new Uint8Array([251, 54, 54, 233, 180, 125, 203, 107])
    ),
    0
  )) {
    return 9 /* OpenMarginAccount */;
  }
  if (containsBytes(
    data,
    fixEncoderSize34(getBytesEncoder46(), 8).encode(
      new Uint8Array([135, 128, 47, 77, 15, 152, 240, 49])
    ),
    0
  )) {
    return 10 /* OpenPosition */;
  }
  if (containsBytes(
    data,
    fixEncoderSize34(getBytesEncoder46(), 8).encode(
      new Uint8Array([91, 136, 224, 68, 150, 221, 18, 207])
    ),
    0
  )) {
    return 11 /* ReclaimAirdrop */;
  }
  if (containsBytes(
    data,
    fixEncoderSize34(getBytesEncoder46(), 8).encode(
      new Uint8Array([66, 92, 186, 127, 188, 0, 23, 207])
    ),
    0
  )) {
    return 12 /* RefreshMarketPrice */;
  }
  if (containsBytes(
    data,
    fixEncoderSize34(getBytesEncoder46(), 8).encode(
      new Uint8Array([2, 167, 98, 66, 122, 255, 254, 216])
    ),
    0
  )) {
    return 13 /* RequestListing */;
  }
  if (containsBytes(
    data,
    fixEncoderSize34(getBytesEncoder46(), 8).encode(
      new Uint8Array([68, 198, 103, 192, 149, 141, 34, 156])
    ),
    0
  )) {
    return 14 /* RetireMarket */;
  }
  if (containsBytes(
    data,
    fixEncoderSize34(getBytesEncoder46(), 8).encode(
      new Uint8Array([72, 200, 22, 148, 177, 183, 136, 29])
    ),
    0
  )) {
    return 15 /* RoutePlatformRevenue */;
  }
  if (containsBytes(
    data,
    fixEncoderSize34(getBytesEncoder46(), 8).encode(
      new Uint8Array([248, 247, 236, 188, 45, 130, 117, 221])
    ),
    0
  )) {
    return 16 /* RouteTokenCreatorRevenue */;
  }
  if (containsBytes(
    data,
    fixEncoderSize34(getBytesEncoder46(), 8).encode(
      new Uint8Array([199, 59, 208, 95, 38, 69, 168, 183])
    ),
    0
  )) {
    return 17 /* SetListingApproved */;
  }
  if (containsBytes(
    data,
    fixEncoderSize34(getBytesEncoder46(), 8).encode(
      new Uint8Array([211, 65, 230, 231, 156, 48, 13, 25])
    ),
    0
  )) {
    return 18 /* SetListingPermitExpiry */;
  }
  if (containsBytes(
    data,
    fixEncoderSize34(getBytesEncoder46(), 8).encode(
      new Uint8Array([206, 60, 159, 159, 62, 242, 4, 82])
    ),
    0
  )) {
    return 19 /* SetMarketEnabled */;
  }
  if (containsBytes(
    data,
    fixEncoderSize34(getBytesEncoder46(), 8).encode(
      new Uint8Array([91, 60, 125, 192, 176, 225, 166, 218])
    ),
    0
  )) {
    return 20 /* SetPaused */;
  }
  if (containsBytes(
    data,
    fixEncoderSize34(getBytesEncoder46(), 8).encode(
      new Uint8Array([33, 156, 74, 218, 215, 42, 112, 175])
    ),
    0
  )) {
    return 21 /* SettlePosition */;
  }
  if (containsBytes(
    data,
    fixEncoderSize34(getBytesEncoder46(), 8).encode(
      new Uint8Array([183, 18, 70, 156, 148, 109, 161, 34])
    ),
    0
  )) {
    return 22 /* Withdraw */;
  }
  if (containsBytes(
    data,
    fixEncoderSize34(getBytesEncoder46(), 8).encode(
      new Uint8Array([151, 228, 127, 80, 156, 209, 76, 82])
    ),
    0
  )) {
    return 23 /* WithdrawMarketLiquidity */;
  }
  throw new SolanaError25(
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
    case 4 /* CreateAirdrop */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 4 /* CreateAirdrop */,
        ...parseCreateAirdropInstruction(instruction)
      };
    }
    case 5 /* CreateMarket */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 5 /* CreateMarket */,
        ...parseCreateMarketInstruction(instruction)
      };
    }
    case 6 /* Deposit */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 6 /* Deposit */,
        ...parseDepositInstruction(instruction)
      };
    }
    case 7 /* FundMarket */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 7 /* FundMarket */,
        ...parseFundMarketInstruction(instruction)
      };
    }
    case 8 /* InitializeProtocol */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 8 /* InitializeProtocol */,
        ...parseInitializeProtocolInstruction(instruction)
      };
    }
    case 9 /* OpenMarginAccount */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 9 /* OpenMarginAccount */,
        ...parseOpenMarginAccountInstruction(instruction)
      };
    }
    case 10 /* OpenPosition */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 10 /* OpenPosition */,
        ...parseOpenPositionInstruction(instruction)
      };
    }
    case 11 /* ReclaimAirdrop */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 11 /* ReclaimAirdrop */,
        ...parseReclaimAirdropInstruction(instruction)
      };
    }
    case 12 /* RefreshMarketPrice */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 12 /* RefreshMarketPrice */,
        ...parseRefreshMarketPriceInstruction(instruction)
      };
    }
    case 13 /* RequestListing */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 13 /* RequestListing */,
        ...parseRequestListingInstruction(instruction)
      };
    }
    case 14 /* RetireMarket */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 14 /* RetireMarket */,
        ...parseRetireMarketInstruction(instruction)
      };
    }
    case 15 /* RoutePlatformRevenue */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 15 /* RoutePlatformRevenue */,
        ...parseRoutePlatformRevenueInstruction(instruction)
      };
    }
    case 16 /* RouteTokenCreatorRevenue */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 16 /* RouteTokenCreatorRevenue */,
        ...parseRouteTokenCreatorRevenueInstruction(instruction)
      };
    }
    case 17 /* SetListingApproved */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 17 /* SetListingApproved */,
        ...parseSetListingApprovedInstruction(instruction)
      };
    }
    case 18 /* SetListingPermitExpiry */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 18 /* SetListingPermitExpiry */,
        ...parseSetListingPermitExpiryInstruction(instruction)
      };
    }
    case 19 /* SetMarketEnabled */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 19 /* SetMarketEnabled */,
        ...parseSetMarketEnabledInstruction(instruction)
      };
    }
    case 20 /* SetPaused */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 20 /* SetPaused */,
        ...parseSetPausedInstruction(instruction)
      };
    }
    case 21 /* SettlePosition */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 21 /* SettlePosition */,
        ...parseSettlePositionInstruction(instruction)
      };
    }
    case 22 /* Withdraw */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 22 /* Withdraw */,
        ...parseWithdrawInstruction(instruction)
      };
    }
    case 23 /* WithdrawMarketLiquidity */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 23 /* WithdrawMarketLiquidity */,
        ...parseWithdrawMarketLiquidityInstruction(instruction)
      };
    }
    default:
      throw new SolanaError25(
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
          protocol: addSelfFetchFunctions(client, getProtocolCodec())
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
var levermemeErrorMessages;
if (process.env["NODE_ENV"] !== "production") {
  levermemeErrorMessages = {
    [LEVERMEME_ERROR__ADMISSION]: `Listing admission or review missing`,
    [LEVERMEME_ERROR__ALREADY_CANCELLED]: `Listing was already cancelled`,
    [LEVERMEME_ERROR__AMOUNT]: `Invalid amount or leverage`,
    [LEVERMEME_ERROR__CAMPAIGN_CLOSED]: `Airdrop has not started, has expired, or was reclaimed`,
    [LEVERMEME_ERROR__CLOSED]: `Market or position is closed`,
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
  combineCodec as combineCodec35,
  containsBytes as containsBytes2,
  fixEncoderSize as fixEncoderSize35,
  getAddressDecoder as getAddressDecoder11,
  getAddressEncoder as getAddressEncoder25,
  getBytesEncoder as getBytesEncoder47,
  getConstantDecoder,
  getConstantEncoder,
  getHiddenPrefixDecoder,
  getHiddenPrefixEncoder,
  getStructDecoder as getStructDecoder35,
  getStructEncoder as getStructEncoder35,
  getU64Decoder as getU64Decoder20,
  getU64Encoder as getU64Encoder21
} from "@solana/kit";
var AIRDROP_CLAIMED_EVENT_DISCRIMINATOR = new Uint8Array([125, 251, 195, 183, 202, 126, 89, 68]);
function getAirdropClaimedEventDiscriminatorBytes() {
  return fixEncoderSize35(getBytesEncoder47(), 8).encode(
    AIRDROP_CLAIMED_EVENT_DISCRIMINATOR
  );
}
function getAirdropClaimedEventEncoder() {
  return getHiddenPrefixEncoder(
    getStructEncoder35([
      ["campaign", getAddressEncoder25()],
      ["owner", getAddressEncoder25()],
      ["amount", getU64Encoder21()]
    ]),
    [getConstantEncoder(AIRDROP_CLAIMED_EVENT_DISCRIMINATOR)]
  );
}
function getAirdropClaimedEventDecoder() {
  return getHiddenPrefixDecoder(
    getStructDecoder35([
      ["campaign", getAddressDecoder11()],
      ["owner", getAddressDecoder11()],
      ["amount", getU64Decoder20()]
    ]),
    [getConstantDecoder(AIRDROP_CLAIMED_EVENT_DISCRIMINATOR)]
  );
}
function getAirdropClaimedEventCodec() {
  return combineCodec35(
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
  combineCodec as combineCodec36,
  containsBytes as containsBytes3,
  fixEncoderSize as fixEncoderSize36,
  getAddressDecoder as getAddressDecoder12,
  getAddressEncoder as getAddressEncoder26,
  getBytesEncoder as getBytesEncoder48,
  getConstantDecoder as getConstantDecoder2,
  getConstantEncoder as getConstantEncoder2,
  getHiddenPrefixDecoder as getHiddenPrefixDecoder2,
  getHiddenPrefixEncoder as getHiddenPrefixEncoder2,
  getI64Decoder as getI64Decoder9,
  getI64Encoder as getI64Encoder9,
  getStructDecoder as getStructDecoder36,
  getStructEncoder as getStructEncoder36,
  getU64Decoder as getU64Decoder21,
  getU64Encoder as getU64Encoder22
} from "@solana/kit";
var AIRDROP_CREATED_EVENT_DISCRIMINATOR = new Uint8Array([190, 219, 101, 33, 208, 187, 149, 96]);
function getAirdropCreatedEventDiscriminatorBytes() {
  return fixEncoderSize36(getBytesEncoder48(), 8).encode(
    AIRDROP_CREATED_EVENT_DISCRIMINATOR
  );
}
function getAirdropCreatedEventEncoder() {
  return getHiddenPrefixEncoder2(
    getStructEncoder36([
      ["campaign", getAddressEncoder26()],
      ["total", getU64Encoder22()],
      ["startsAt", getI64Encoder9()],
      ["endsAt", getI64Encoder9()]
    ]),
    [getConstantEncoder2(AIRDROP_CREATED_EVENT_DISCRIMINATOR)]
  );
}
function getAirdropCreatedEventDecoder() {
  return getHiddenPrefixDecoder2(
    getStructDecoder36([
      ["campaign", getAddressDecoder12()],
      ["total", getU64Decoder21()],
      ["startsAt", getI64Decoder9()],
      ["endsAt", getI64Decoder9()]
    ]),
    [getConstantDecoder2(AIRDROP_CREATED_EVENT_DISCRIMINATOR)]
  );
}
function getAirdropCreatedEventCodec() {
  return combineCodec36(
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
  combineCodec as combineCodec37,
  containsBytes as containsBytes4,
  fixEncoderSize as fixEncoderSize37,
  getAddressDecoder as getAddressDecoder13,
  getAddressEncoder as getAddressEncoder27,
  getBooleanDecoder as getBooleanDecoder11,
  getBooleanEncoder as getBooleanEncoder11,
  getBytesEncoder as getBytesEncoder49,
  getConstantDecoder as getConstantDecoder3,
  getConstantEncoder as getConstantEncoder3,
  getHiddenPrefixDecoder as getHiddenPrefixDecoder3,
  getHiddenPrefixEncoder as getHiddenPrefixEncoder3,
  getStructDecoder as getStructDecoder37,
  getStructEncoder as getStructEncoder37,
  getU64Decoder as getU64Decoder22,
  getU64Encoder as getU64Encoder23
} from "@solana/kit";
var COLLATERAL_CHANGED_EVENT_DISCRIMINATOR = new Uint8Array([172, 114, 48, 57, 98, 83, 95, 157]);
function getCollateralChangedEventDiscriminatorBytes() {
  return fixEncoderSize37(getBytesEncoder49(), 8).encode(
    COLLATERAL_CHANGED_EVENT_DISCRIMINATOR
  );
}
function getCollateralChangedEventEncoder() {
  return getHiddenPrefixEncoder3(
    getStructEncoder37([
      ["margin", getAddressEncoder27()],
      ["owner", getAddressEncoder27()],
      ["amount", getU64Encoder23()],
      ["deposit", getBooleanEncoder11()],
      ["balance", getU64Encoder23()]
    ]),
    [getConstantEncoder3(COLLATERAL_CHANGED_EVENT_DISCRIMINATOR)]
  );
}
function getCollateralChangedEventDecoder() {
  return getHiddenPrefixDecoder3(
    getStructDecoder37([
      ["margin", getAddressDecoder13()],
      ["owner", getAddressDecoder13()],
      ["amount", getU64Decoder22()],
      ["deposit", getBooleanDecoder11()],
      ["balance", getU64Decoder22()]
    ]),
    [getConstantDecoder3(COLLATERAL_CHANGED_EVENT_DISCRIMINATOR)]
  );
}
function getCollateralChangedEventCodec() {
  return combineCodec37(
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
  combineCodec as combineCodec38,
  containsBytes as containsBytes5,
  fixEncoderSize as fixEncoderSize38,
  getAddressDecoder as getAddressDecoder14,
  getAddressEncoder as getAddressEncoder28,
  getBytesEncoder as getBytesEncoder50,
  getConstantDecoder as getConstantDecoder4,
  getConstantEncoder as getConstantEncoder4,
  getHiddenPrefixDecoder as getHiddenPrefixDecoder4,
  getHiddenPrefixEncoder as getHiddenPrefixEncoder4,
  getStructDecoder as getStructDecoder38,
  getStructEncoder as getStructEncoder38
} from "@solana/kit";
var LISTING_CANCELLED_EVENT_DISCRIMINATOR = new Uint8Array([11, 46, 163, 10, 103, 80, 139, 194]);
function getListingCancelledEventDiscriminatorBytes() {
  return fixEncoderSize38(getBytesEncoder50(), 8).encode(
    LISTING_CANCELLED_EVENT_DISCRIMINATOR
  );
}
function getListingCancelledEventEncoder() {
  return getHiddenPrefixEncoder4(
    getStructEncoder38([
      ["listing", getAddressEncoder28()],
      ["lister", getAddressEncoder28()]
    ]),
    [getConstantEncoder4(LISTING_CANCELLED_EVENT_DISCRIMINATOR)]
  );
}
function getListingCancelledEventDecoder() {
  return getHiddenPrefixDecoder4(
    getStructDecoder38([
      ["listing", getAddressDecoder14()],
      ["lister", getAddressDecoder14()]
    ]),
    [getConstantDecoder4(LISTING_CANCELLED_EVENT_DISCRIMINATOR)]
  );
}
function getListingCancelledEventCodec() {
  return combineCodec38(
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
  combineCodec as combineCodec39,
  containsBytes as containsBytes6,
  fixEncoderSize as fixEncoderSize39,
  getAddressDecoder as getAddressDecoder15,
  getAddressEncoder as getAddressEncoder29,
  getBytesEncoder as getBytesEncoder51,
  getConstantDecoder as getConstantDecoder5,
  getConstantEncoder as getConstantEncoder5,
  getHiddenPrefixDecoder as getHiddenPrefixDecoder5,
  getHiddenPrefixEncoder as getHiddenPrefixEncoder5,
  getStructDecoder as getStructDecoder39,
  getStructEncoder as getStructEncoder39,
  getU64Decoder as getU64Decoder23,
  getU64Encoder as getU64Encoder24
} from "@solana/kit";
var LISTING_REQUESTED_EVENT_DISCRIMINATOR = new Uint8Array([150, 236, 30, 166, 150, 162, 210, 167]);
function getListingRequestedEventDiscriminatorBytes() {
  return fixEncoderSize39(getBytesEncoder51(), 8).encode(
    LISTING_REQUESTED_EVENT_DISCRIMINATOR
  );
}
function getListingRequestedEventEncoder() {
  return getHiddenPrefixEncoder5(
    getStructEncoder39([
      ["listing", getAddressEncoder29()],
      ["lister", getAddressEncoder29()],
      ["baseMint", getAddressEncoder29()],
      ["solLamports", getU64Encoder24()],
      ["tokenAmount", getU64Encoder24()],
      ["burned", getU64Encoder24()]
    ]),
    [getConstantEncoder5(LISTING_REQUESTED_EVENT_DISCRIMINATOR)]
  );
}
function getListingRequestedEventDecoder() {
  return getHiddenPrefixDecoder5(
    getStructDecoder39([
      ["listing", getAddressDecoder15()],
      ["lister", getAddressDecoder15()],
      ["baseMint", getAddressDecoder15()],
      ["solLamports", getU64Decoder23()],
      ["tokenAmount", getU64Decoder23()],
      ["burned", getU64Decoder23()]
    ]),
    [getConstantDecoder5(LISTING_REQUESTED_EVENT_DISCRIMINATOR)]
  );
}
function getListingRequestedEventCodec() {
  return combineCodec39(
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
  combineCodec as combineCodec40,
  containsBytes as containsBytes7,
  fixEncoderSize as fixEncoderSize40,
  getAddressDecoder as getAddressDecoder16,
  getAddressEncoder as getAddressEncoder30,
  getBooleanDecoder as getBooleanDecoder12,
  getBooleanEncoder as getBooleanEncoder12,
  getBytesEncoder as getBytesEncoder52,
  getConstantDecoder as getConstantDecoder6,
  getConstantEncoder as getConstantEncoder6,
  getHiddenPrefixDecoder as getHiddenPrefixDecoder6,
  getHiddenPrefixEncoder as getHiddenPrefixEncoder6,
  getStructDecoder as getStructDecoder40,
  getStructEncoder as getStructEncoder40
} from "@solana/kit";
var LISTING_REVIEWED_EVENT_DISCRIMINATOR = new Uint8Array([33, 226, 137, 167, 158, 100, 9, 238]);
function getListingReviewedEventDiscriminatorBytes() {
  return fixEncoderSize40(getBytesEncoder52(), 8).encode(
    LISTING_REVIEWED_EVENT_DISCRIMINATOR
  );
}
function getListingReviewedEventEncoder() {
  return getHiddenPrefixEncoder6(
    getStructEncoder40([
      ["listing", getAddressEncoder30()],
      ["approved", getBooleanEncoder12()]
    ]),
    [getConstantEncoder6(LISTING_REVIEWED_EVENT_DISCRIMINATOR)]
  );
}
function getListingReviewedEventDecoder() {
  return getHiddenPrefixDecoder6(
    getStructDecoder40([
      ["listing", getAddressDecoder16()],
      ["approved", getBooleanDecoder12()]
    ]),
    [getConstantDecoder6(LISTING_REVIEWED_EVENT_DISCRIMINATOR)]
  );
}
function getListingReviewedEventCodec() {
  return combineCodec40(
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
  combineCodec as combineCodec41,
  containsBytes as containsBytes8,
  fixEncoderSize as fixEncoderSize41,
  getAddressDecoder as getAddressDecoder17,
  getAddressEncoder as getAddressEncoder31,
  getBooleanDecoder as getBooleanDecoder13,
  getBooleanEncoder as getBooleanEncoder13,
  getBytesEncoder as getBytesEncoder53,
  getConstantDecoder as getConstantDecoder7,
  getConstantEncoder as getConstantEncoder7,
  getHiddenPrefixDecoder as getHiddenPrefixDecoder7,
  getHiddenPrefixEncoder as getHiddenPrefixEncoder7,
  getStructDecoder as getStructDecoder41,
  getStructEncoder as getStructEncoder41
} from "@solana/kit";
var PAUSE_CHANGED_EVENT_DISCRIMINATOR = new Uint8Array([238, 188, 213, 78, 134, 209, 178, 218]);
function getPauseChangedEventDiscriminatorBytes() {
  return fixEncoderSize41(getBytesEncoder53(), 8).encode(
    PAUSE_CHANGED_EVENT_DISCRIMINATOR
  );
}
function getPauseChangedEventEncoder() {
  return getHiddenPrefixEncoder7(
    getStructEncoder41([
      ["protocol", getAddressEncoder31()],
      ["paused", getBooleanEncoder13()]
    ]),
    [getConstantEncoder7(PAUSE_CHANGED_EVENT_DISCRIMINATOR)]
  );
}
function getPauseChangedEventDecoder() {
  return getHiddenPrefixDecoder7(
    getStructDecoder41([
      ["protocol", getAddressDecoder17()],
      ["paused", getBooleanDecoder13()]
    ]),
    [getConstantDecoder7(PAUSE_CHANGED_EVENT_DISCRIMINATOR)]
  );
}
function getPauseChangedEventCodec() {
  return combineCodec41(
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

// clients/generated/events/positionOpened.ts
import {
  combineCodec as combineCodec42,
  containsBytes as containsBytes9,
  fixEncoderSize as fixEncoderSize42,
  getAddressDecoder as getAddressDecoder18,
  getAddressEncoder as getAddressEncoder32,
  getBooleanDecoder as getBooleanDecoder14,
  getBooleanEncoder as getBooleanEncoder14,
  getBytesEncoder as getBytesEncoder54,
  getConstantDecoder as getConstantDecoder8,
  getConstantEncoder as getConstantEncoder8,
  getHiddenPrefixDecoder as getHiddenPrefixDecoder8,
  getHiddenPrefixEncoder as getHiddenPrefixEncoder8,
  getStructDecoder as getStructDecoder42,
  getStructEncoder as getStructEncoder42,
  getU64Decoder as getU64Decoder24,
  getU64Encoder as getU64Encoder25
} from "@solana/kit";
var POSITION_OPENED_EVENT_DISCRIMINATOR = new Uint8Array([237, 175, 243, 230, 147, 117, 101, 121]);
function getPositionOpenedEventDiscriminatorBytes() {
  return fixEncoderSize42(getBytesEncoder54(), 8).encode(
    POSITION_OPENED_EVENT_DISCRIMINATOR
  );
}
function getPositionOpenedEventEncoder() {
  return getHiddenPrefixEncoder8(
    getStructEncoder42([
      ["position", getAddressEncoder32()],
      ["owner", getAddressEncoder32()],
      ["market", getAddressEncoder32()],
      ["notional", getU64Encoder25()],
      ["collateral", getU64Encoder25()],
      ["entryPrice", getU64Encoder25()],
      ["maxProfit", getU64Encoder25()],
      ["long", getBooleanEncoder14()]
    ]),
    [getConstantEncoder8(POSITION_OPENED_EVENT_DISCRIMINATOR)]
  );
}
function getPositionOpenedEventDecoder() {
  return getHiddenPrefixDecoder8(
    getStructDecoder42([
      ["position", getAddressDecoder18()],
      ["owner", getAddressDecoder18()],
      ["market", getAddressDecoder18()],
      ["notional", getU64Decoder24()],
      ["collateral", getU64Decoder24()],
      ["entryPrice", getU64Decoder24()],
      ["maxProfit", getU64Decoder24()],
      ["long", getBooleanDecoder14()]
    ]),
    [getConstantDecoder8(POSITION_OPENED_EVENT_DISCRIMINATOR)]
  );
}
function getPositionOpenedEventCodec() {
  return combineCodec42(
    getPositionOpenedEventEncoder(),
    getPositionOpenedEventDecoder()
  );
}
function parsePositionOpenedEvent(data) {
  if (containsBytes9(data, POSITION_OPENED_EVENT_DISCRIMINATOR, 0)) {
    return getPositionOpenedEventDecoder().decode(data);
  }
  throw new Error(
    'The provided data does not match the "PositionOpenedEvent" event discriminators.'
  );
}

// clients/generated/events/positionSettled.ts
import {
  combineCodec as combineCodec43,
  containsBytes as containsBytes10,
  fixEncoderSize as fixEncoderSize43,
  getAddressDecoder as getAddressDecoder19,
  getAddressEncoder as getAddressEncoder33,
  getBytesEncoder as getBytesEncoder55,
  getConstantDecoder as getConstantDecoder9,
  getConstantEncoder as getConstantEncoder9,
  getHiddenPrefixDecoder as getHiddenPrefixDecoder9,
  getHiddenPrefixEncoder as getHiddenPrefixEncoder9,
  getStructDecoder as getStructDecoder43,
  getStructEncoder as getStructEncoder43,
  getU64Decoder as getU64Decoder25,
  getU64Encoder as getU64Encoder26,
  getU8Decoder as getU8Decoder11,
  getU8Encoder as getU8Encoder11
} from "@solana/kit";
var POSITION_SETTLED_EVENT_DISCRIMINATOR = new Uint8Array([75, 100, 92, 189, 245, 116, 252, 221]);
function getPositionSettledEventDiscriminatorBytes() {
  return fixEncoderSize43(getBytesEncoder55(), 8).encode(
    POSITION_SETTLED_EVENT_DISCRIMINATOR
  );
}
function getPositionSettledEventEncoder() {
  return getHiddenPrefixEncoder9(
    getStructEncoder43([
      ["position", getAddressEncoder33()],
      ["owner", getAddressEncoder33()],
      ["market", getAddressEncoder33()],
      ["payout", getU64Encoder26()],
      ["fee", getU64Encoder26()],
      ["bounty", getU64Encoder26()],
      ["exitPrice", getU64Encoder26()],
      ["reason", getU8Encoder11()]
    ]),
    [getConstantEncoder9(POSITION_SETTLED_EVENT_DISCRIMINATOR)]
  );
}
function getPositionSettledEventDecoder() {
  return getHiddenPrefixDecoder9(
    getStructDecoder43([
      ["position", getAddressDecoder19()],
      ["owner", getAddressDecoder19()],
      ["market", getAddressDecoder19()],
      ["payout", getU64Decoder25()],
      ["fee", getU64Decoder25()],
      ["bounty", getU64Decoder25()],
      ["exitPrice", getU64Decoder25()],
      ["reason", getU8Decoder11()]
    ]),
    [getConstantDecoder9(POSITION_SETTLED_EVENT_DISCRIMINATOR)]
  );
}
function getPositionSettledEventCodec() {
  return combineCodec43(
    getPositionSettledEventEncoder(),
    getPositionSettledEventDecoder()
  );
}
function parsePositionSettledEvent(data) {
  if (containsBytes10(data, POSITION_SETTLED_EVENT_DISCRIMINATOR, 0)) {
    return getPositionSettledEventDecoder().decode(data);
  }
  throw new Error(
    'The provided data does not match the "PositionSettledEvent" event discriminators.'
  );
}

// clients/generated/events/priceRefreshed.ts
import {
  combineCodec as combineCodec44,
  containsBytes as containsBytes11,
  fixEncoderSize as fixEncoderSize44,
  getAddressDecoder as getAddressDecoder20,
  getAddressEncoder as getAddressEncoder34,
  getBytesEncoder as getBytesEncoder56,
  getConstantDecoder as getConstantDecoder10,
  getConstantEncoder as getConstantEncoder10,
  getHiddenPrefixDecoder as getHiddenPrefixDecoder10,
  getHiddenPrefixEncoder as getHiddenPrefixEncoder10,
  getStructDecoder as getStructDecoder44,
  getStructEncoder as getStructEncoder44,
  getU64Decoder as getU64Decoder26,
  getU64Encoder as getU64Encoder27
} from "@solana/kit";
var PRICE_REFRESHED_EVENT_DISCRIMINATOR = new Uint8Array([64, 39, 28, 72, 53, 221, 84, 139]);
function getPriceRefreshedEventDiscriminatorBytes() {
  return fixEncoderSize44(getBytesEncoder56(), 8).encode(
    PRICE_REFRESHED_EVENT_DISCRIMINATOR
  );
}
function getPriceRefreshedEventEncoder() {
  return getHiddenPrefixEncoder10(
    getStructEncoder44([
      ["market", getAddressEncoder34()],
      ["price", getU64Encoder27()],
      ["slot", getU64Encoder27()]
    ]),
    [getConstantEncoder10(PRICE_REFRESHED_EVENT_DISCRIMINATOR)]
  );
}
function getPriceRefreshedEventDecoder() {
  return getHiddenPrefixDecoder10(
    getStructDecoder44([
      ["market", getAddressDecoder20()],
      ["price", getU64Decoder26()],
      ["slot", getU64Decoder26()]
    ]),
    [getConstantDecoder10(PRICE_REFRESHED_EVENT_DISCRIMINATOR)]
  );
}
function getPriceRefreshedEventCodec() {
  return combineCodec44(
    getPriceRefreshedEventEncoder(),
    getPriceRefreshedEventDecoder()
  );
}
function parsePriceRefreshedEvent(data) {
  if (containsBytes11(data, PRICE_REFRESHED_EVENT_DISCRIMINATOR, 0)) {
    return getPriceRefreshedEventDecoder().decode(data);
  }
  throw new Error(
    'The provided data does not match the "PriceRefreshedEvent" event discriminators.'
  );
}

// clients/generated/events/protocolCreated.ts
import {
  combineCodec as combineCodec45,
  containsBytes as containsBytes12,
  fixEncoderSize as fixEncoderSize45,
  getAddressDecoder as getAddressDecoder21,
  getAddressEncoder as getAddressEncoder35,
  getBytesEncoder as getBytesEncoder57,
  getConstantDecoder as getConstantDecoder11,
  getConstantEncoder as getConstantEncoder11,
  getHiddenPrefixDecoder as getHiddenPrefixDecoder11,
  getHiddenPrefixEncoder as getHiddenPrefixEncoder11,
  getStructDecoder as getStructDecoder45,
  getStructEncoder as getStructEncoder45
} from "@solana/kit";
var PROTOCOL_CREATED_EVENT_DISCRIMINATOR = new Uint8Array([15, 251, 247, 158, 97, 201, 1, 226]);
function getProtocolCreatedEventDiscriminatorBytes() {
  return fixEncoderSize45(getBytesEncoder57(), 8).encode(
    PROTOCOL_CREATED_EVENT_DISCRIMINATOR
  );
}
function getProtocolCreatedEventEncoder() {
  return getHiddenPrefixEncoder11(
    getStructEncoder45([
      ["protocol", getAddressEncoder35()],
      ["admin", getAddressEncoder35()]
    ]),
    [getConstantEncoder11(PROTOCOL_CREATED_EVENT_DISCRIMINATOR)]
  );
}
function getProtocolCreatedEventDecoder() {
  return getHiddenPrefixDecoder11(
    getStructDecoder45([
      ["protocol", getAddressDecoder21()],
      ["admin", getAddressDecoder21()]
    ]),
    [getConstantDecoder11(PROTOCOL_CREATED_EVENT_DISCRIMINATOR)]
  );
}
function getProtocolCreatedEventCodec() {
  return combineCodec45(
    getProtocolCreatedEventEncoder(),
    getProtocolCreatedEventDecoder()
  );
}
function parseProtocolCreatedEvent(data) {
  if (containsBytes12(data, PROTOCOL_CREATED_EVENT_DISCRIMINATOR, 0)) {
    return getProtocolCreatedEventDecoder().decode(data);
  }
  throw new Error(
    'The provided data does not match the "ProtocolCreatedEvent" event discriminators.'
  );
}

// clients/generated/events/revenueRouted.ts
import {
  combineCodec as combineCodec46,
  containsBytes as containsBytes13,
  fixEncoderSize as fixEncoderSize46,
  getAddressDecoder as getAddressDecoder22,
  getAddressEncoder as getAddressEncoder36,
  getArrayDecoder as getArrayDecoder3,
  getArrayEncoder as getArrayEncoder3,
  getBytesEncoder as getBytesEncoder58,
  getConstantDecoder as getConstantDecoder12,
  getConstantEncoder as getConstantEncoder12,
  getHiddenPrefixDecoder as getHiddenPrefixDecoder12,
  getHiddenPrefixEncoder as getHiddenPrefixEncoder12,
  getStructDecoder as getStructDecoder46,
  getStructEncoder as getStructEncoder46,
  getU64Decoder as getU64Decoder27,
  getU64Encoder as getU64Encoder28,
  getU8Decoder as getU8Decoder12,
  getU8Encoder as getU8Encoder12
} from "@solana/kit";
var REVENUE_ROUTED_EVENT_DISCRIMINATOR = new Uint8Array([57, 95, 242, 242, 222, 199, 192, 120]);
function getRevenueRoutedEventDiscriminatorBytes() {
  return fixEncoderSize46(getBytesEncoder58(), 8).encode(
    REVENUE_ROUTED_EVENT_DISCRIMINATOR
  );
}
function getRevenueRoutedEventEncoder() {
  return getHiddenPrefixEncoder12(
    getStructEncoder46([
      ["protocol", getAddressEncoder36()],
      ["amount", getU64Encoder28()],
      ["kind", getU8Encoder12()],
      ["parts", getArrayEncoder3(getU64Encoder28(), { size: 4 })]
    ]),
    [getConstantEncoder12(REVENUE_ROUTED_EVENT_DISCRIMINATOR)]
  );
}
function getRevenueRoutedEventDecoder() {
  return getHiddenPrefixDecoder12(
    getStructDecoder46([
      ["protocol", getAddressDecoder22()],
      ["amount", getU64Decoder27()],
      ["kind", getU8Decoder12()],
      ["parts", getArrayDecoder3(getU64Decoder27(), { size: 4 })]
    ]),
    [getConstantDecoder12(REVENUE_ROUTED_EVENT_DISCRIMINATOR)]
  );
}
function getRevenueRoutedEventCodec() {
  return combineCodec46(
    getRevenueRoutedEventEncoder(),
    getRevenueRoutedEventDecoder()
  );
}
function parseRevenueRoutedEvent(data) {
  if (containsBytes13(data, REVENUE_ROUTED_EVENT_DISCRIMINATOR, 0)) {
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
  CANCEL_LISTING_DISCRIMINATOR,
  CLAIM_AIRDROP_DISCRIMINATOR,
  COLLATERAL_CHANGED_EVENT_DISCRIMINATOR,
  COLLECT_MARKET_FEES_DISCRIMINATOR,
  CREATE_AIRDROP_DISCRIMINATOR,
  CREATE_MARKET_DISCRIMINATOR,
  DEPOSIT_DISCRIMINATOR,
  FUND_MARKET_DISCRIMINATOR,
  INITIALIZE_PROTOCOL_DISCRIMINATOR,
  LEVERMEME_ERROR__ADMISSION,
  LEVERMEME_ERROR__ALREADY_CANCELLED,
  LEVERMEME_ERROR__AMOUNT,
  LEVERMEME_ERROR__CAMPAIGN_CLOSED,
  LEVERMEME_ERROR__CLOSED,
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
  decodeAirdropCampaign,
  decodeAirdropClaim,
  decodeListing,
  decodeListingPermit,
  decodeMarginAccount,
  decodeMarket,
  decodePosition,
  decodeProtocol,
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
  fetchAllPosition,
  fetchAllProtocol,
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
  fetchPosition,
  fetchProtocol,
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
  getDepositDiscriminatorBytes,
  getDepositInstruction,
  getDepositInstructionAsync,
  getDepositInstructionDataCodec,
  getDepositInstructionDataDecoder,
  getDepositInstructionDataEncoder,
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
  identifyLevermemeAccount,
  identifyLevermemeEvent,
  identifyLevermemeInstruction,
  isLevermemeError,
  levermemeProgram,
  parseAirdropClaimedEvent,
  parseAirdropCreatedEvent,
  parseApproveListingPermitInstruction,
  parseCancelListingInstruction,
  parseClaimAirdropInstruction,
  parseCollateralChangedEvent,
  parseCollectMarketFeesInstruction,
  parseCreateAirdropInstruction,
  parseCreateMarketInstruction,
  parseDepositInstruction,
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
  parseWithdrawMarketLiquidityInstruction
};
