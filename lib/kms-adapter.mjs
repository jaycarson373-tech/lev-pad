import { createPublicKey,verify } from 'node:crypto';
import { getAddressDecoder } from '@solana/kit';
// AWS primary references: API_GetPublicKey and API_Sign. Solana uses pure
// Ed25519: ED25519_SHA_512 + RAW, never Ed25519ph or a caller-supplied digest.
export async function kmsAdapter({transport,keyId,wallet}){
 if(!/^arn:aws(?:-[a-z-]+)?:kms:[a-z0-9-]+:\d{12}:key\/[A-Za-z0-9-]+$/.test(keyId))throw new Error('Pin the full KMS key ARN, not a mutable alias.');
 const info=await transport.getPublicKey({KeyId:keyId});
 if(info.KeyId!==keyId||info.KeySpec!=='ECC_NIST_EDWARDS25519'||info.KeyUsage!=='SIGN_VERIFY'||!info.SigningAlgorithms?.includes('ED25519_SHA_512'))throw new Error('KMS key identity/type/usage rejected.');
 const publicKey=createPublicKey({key:Buffer.from(info.PublicKey),format:'der',type:'spki'});
 if(publicKey.asymmetricKeyType!=='ed25519')throw new Error('KMS public key is not Ed25519.');
 const bytes=Buffer.from(publicKey.export({format:'jwk'}).x,'base64url');
 if(bytes.length!==32||getAddressDecoder().decode(bytes)!==wallet)throw new Error('KMS public key does not match the configured Solana wallet.');
 return {wallet,async signMessage(message){
  if(!(message instanceof Uint8Array)||message.length>1232)throw new Error('Signing message size rejected.');
  const result=await transport.sign({KeyId:keyId,Message:message,MessageType:'RAW',SigningAlgorithm:'ED25519_SHA_512'});
  const signature=Buffer.from(result.Signature??[]);
  if(result.KeyId!==keyId||result.SigningAlgorithm!=='ED25519_SHA_512'||signature.length!==64||!verify(null,message,publicKey,signature))throw new Error('KMS signature failed local verification.');
  return new Uint8Array(signature);
 }};
}
