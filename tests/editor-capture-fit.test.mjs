// Compile the actual production C# FitRect arithmetic. Only Rect's inert value
// container is supplied here; no Unity Editor or graphics API is substituted.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const repo=fileURLToPath(new URL('../',import.meta.url));
const runtime='E:/TuanJieAllVersion/2022.3.62t16/Editor/Data/MonoBleedingEdge';
const mono=path.join(runtime,'bin/mono.exe'),compiler=path.join(runtime,'lib/mono/4.5/mcs.exe');
const run=path.join('F:/AI/AgentMake/temp/GameCowork/tests','editor-capture-fit-'+randomUUID());
const source=fs.readFileSync(path.join(repo,'restored/editor-bridge/Editor/EditorCapture.cs'),'utf8');
const begin=source.indexOf('        internal static Rect FitRect('),end=source.indexOf('        internal static void DrawFit(',begin);
assert.ok(begin>=0&&end>begin,'Actual production FitRect method must exist');
const method=source.slice(begin,end);
const cases=[
  [376,741,250,462], // Actual failing source/frame: old float gives negative y.
  [376,747,250,463], // Another fitted height rounds past its private texture.
  [376,741,225,442],
  [1920,1080,225,442],
  [1080,1920,442,225],
  [1920,1080,1920,1080],
  [1024,1024,640,640],
  [1920,1002,250,462],
  [32768,1,1920,16],
  [1,32768,16,1080],
];
for(const [width,height]of [[16,16],[250,462],[641,359],[1920,1080]])
  for(const [sourceWidth,sourceHeight]of [[376,741],[376,747],[1920,1080],[1080,1920],[4096,2160],[32768,32768]])cases.push([sourceWidth,sourceHeight,width,height]);
fs.mkdirSync(run,{recursive:true});
const program=`using System;using System.Globalization;using UnityEngine;
namespace UnityEngine { struct Rect { public float x,y,width,height;public Rect(float a,float b,float c,float d){x=a;y=b;width=c;height=d;} } }
class Harness {
${method}
static string Number(float value){return value.ToString("R",CultureInfo.InvariantCulture);}
static void Main(){int[,] cases=new int[,] {${cases.map(entry=>'{'+entry.join(',')+'}').join(',')}};
Console.Write("[");for(int index=0;index<cases.GetLength(0);index++){
int sw=cases[index,0],sh=cases[index,1],width=cases[index,2],height=cases[index,3];Rect rect=FitRect(sw,sh,width,height);
float scale=Math.Min((float)width/sw,(float)height/sh),legacyHeight=sh*scale,legacyWidth=sw*scale;
if(index>0)Console.Write(",");Console.Write("{\\\"x\\\":"+Number(rect.x)+",\\\"y\\\":"+Number(rect.y)+",\\\"w\\\":"+Number(rect.width)+",\\\"h\\\":"+Number(rect.height)+",\\\"legacyX\\\":"+Number((width-legacyWidth)/2)+",\\\"legacyY\\\":"+Number((height-legacyHeight)/2)+"}");}Console.Write("]");}
}`;
const input=path.join(run,'FitRect.cs'),output=path.join(run,'FitRect.exe');fs.writeFileSync(input,program);
execFileSync(mono,[compiler,'-out:'+output,input],{windowsHide:true,encoding:'utf8',timeout:15000});
const observations=JSON.parse(execFileSync(mono,[output],{windowsHide:true,encoding:'utf8',timeout:15000}));
fs.writeFileSync(path.join(run,'result.json'),JSON.stringify(cases.map((input,index)=>({input,...observations[index]})),null,2));

test('Actual C# float32 reproduces the old negative fitted edges',()=>{
  assert.ok(observations[0].legacyY<0);assert.ok(observations[1].legacyY<0);
});
test('Actual production C# keeps every fitted frame within strict receiver bounds',()=>{
  for(const [index,[sw,sh,width,height]]of cases.entries()){
    const rect=observations[index],label=JSON.stringify(cases[index]);
    assert.ok([rect.x,rect.y,rect.w,rect.h].every(Number.isFinite),label);
    assert.ok(rect.x>=0&&rect.y>=0&&rect.w>0&&rect.h>0,label);
    assert.ok(rect.x+rect.w<=width+.01&&rect.y+rect.h<=height+.01,label);
    assert.ok(Math.abs(rect.w/rect.h-sw/sh)<=.01,label);
  }
});
test('Actual C# preserves centered positive margins and exact full-size content',()=>{
  assert.equal(observations[0].y,0);assert.ok(observations[0].x>0);
  assert.ok(observations[3].y>0);assert.ok(observations[4].x>0);
  assert.deepEqual(observations[5],{x:0,y:0,w:1920,h:1080,legacyX:0,legacyY:0});
});
