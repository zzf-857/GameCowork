import path from 'node:path';
import os from 'node:os';
import {realpathSync} from 'node:fs';
import {createHash} from 'node:crypto';

export function insightHome(env=process.env, fallback=()=>path.join(os.homedir(),'.unity-insight')) {
  const root=env.UNITY_INSIGHT_HOME?.trim();
  return root ? path.resolve(root) : fallback();
}

export function indexDirectory(project, legacy) {
  if (!process.env.UNITY_INSIGHT_HOME?.trim()) return legacy;
  const requested=process.env.GAMECOWORK_INSIGHT_INDEX_DIR?.trim();
  if(requested){
    const home=insightHome(),directory=path.resolve(requested),relative=path.relative(home,directory);
    if(!relative||relative.startsWith('..')||path.isAbsolute(relative))throw Error('Explicit index directory must stay inside the owned Insight home.');
    return directory;
  }
  let canonical;
  try { canonical=realpathSync(project); } catch { canonical=path.resolve(project); }
  canonical=canonical.replaceAll('\\','/');
  if(process.platform==='win32')canonical=canonical.toLowerCase();
  const identity=createHash('sha256').update(canonical).digest('hex');
  return path.join(insightHome(),'projects',identity);
}
