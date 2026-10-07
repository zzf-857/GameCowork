'use strict';
// Windows user-bound protection. Secrets travel through stdin/stdout pipes;
// command lines, environment variables and diagnostic text contain no key.
const {spawn}=require('node:child_process');
const MAGIC=Buffer.from('GCWPV\x01','binary'),MAX=1024*1024;
function protectedBytes(action,bytes) {
  if(process.platform!=='win32')return Promise.reject(Error('Custom Provider DPAPI vault requires Windows'));
  if(!Buffer.isBuffer(bytes)||bytes.length>MAX)return Promise.reject(Error('Provider vault payload exceeds its byte budget'));
  const script=`$ErrorActionPreference='Stop';Add-Type -AssemblyName System.Security;$raw=[Console]::In.ReadToEnd();if($raw.Length -gt 2097152 -or $raw.Length % 2 -ne 0 -or $raw -match '[^0-9a-f]'){throw 'Invalid vault payload'};$bytes=New-Object byte[] ($raw.Length/2);for($i=0;$i -lt $bytes.Length;$i++){$bytes[$i]=[Convert]::ToByte($raw.Substring($i*2,2),16)};$result=[System.Security.Cryptography.ProtectedData]::${action}($bytes,$null,[System.Security.Cryptography.DataProtectionScope]::CurrentUser);[Console]::Out.Write([BitConverter]::ToString($result).Replace('-','').ToLowerInvariant())`;
  return new Promise((resolve,reject)=> {
    const child=spawn('powershell.exe',['-NoProfile','-NonInteractive','-Command',script],{windowsHide:true,stdio:['pipe','pipe','pipe']}),chunks=[];let count=0,done=false;
    const fail=()=>{if(done)return;done=true;clearTimeout(timer);child.kill();reject(Error('Windows Provider vault operation failed'));};
    const timer=setTimeout(fail,30000);
    child.on('error',fail);child.stdout.on('data',chunk=>{count+=chunk.length;if(count>4*MAX)fail();else chunks.push(chunk);});child.stderr.on('data',()=>{});
    child.stdin.on('error',fail);child.on('close',code=>{if(done)return;done=true;clearTimeout(timer);const hex=Buffer.concat(chunks).toString('ascii');if(code!==0||!hex||hex.length%2||!/^[a-f0-9]+$/.test(hex))reject(Error('Windows Provider vault operation failed'));else resolve(Buffer.from(hex,'hex'));});child.stdin.end(bytes.toString('hex'));
  });
}
async function seal(bytes) {return Buffer.concat([MAGIC,await protectedBytes('Protect',bytes)]);}
async function unseal(bytes) {if(!Buffer.isBuffer(bytes)||bytes.length<=MAGIC.length||bytes.length>MAX||!bytes.subarray(0,MAGIC.length).equals(MAGIC))throw Error('Invalid custom Provider vault framing');return protectedBytes('Unprotect',bytes.subarray(MAGIC.length));}
module.exports={seal,unseal};
