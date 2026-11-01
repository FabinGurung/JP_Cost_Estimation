/**
 * Isolated source-snapshot release gate, no Google credentials or network I/O.
 * Importable in regression tests even when the production Google source is unavailable.
 */
export function decideAmritSnapshot(existing, proposed, latestVersionHistoryRow) {
  const priorVersion=String(existing?.version||'');
  const version=String(proposed?.version||'');
  if(!/^V\d{6}$/.test(priorVersion)||!/^V\d{6}$/.test(version))throw Error('INVALID_NUMBERED_SOURCE_VERSION');
  if(!Array.isArray(proposed?.rates)||!Array.isArray(existing?.rates))throw Error('INVALID_RATE_ARRAY');
  // Same-rate version is idempotent across dates: NOT every scheduled check
  // should manufacture a new website snapshot or demand a source version bump.
  if(version===priorVersion){
    if(JSON.stringify(existing.rates)!==JSON.stringify(proposed.rates))
      throw Error('RATES_CHANGED_WITHOUT_NEW_SOURCE_VERSION');
    return {action:'KEEP_CURRENT_SNAPSHOT',reason:'Same verified source version and identical rate data; freshness checked only in source workflow logs.'};
  }
  if(Number(version.slice(1))!==Number(priorVersion.slice(1))+1)
    throw Error('NONSEQUENTIAL_SOURCE_VERSION');
  if(!latestVersionHistoryRow || String(latestVersionHistoryRow[0])!==version || String(latestVersionHistoryRow[2])!=='POST_VALIDATED' ||
      String(latestVersionHistoryRow[7]||'').trim().length<=5)
    throw Error('NEW_VERSION_LACKS_VALIDATED_PRE_POST_HISTORY');
  return {action:'PUBLISH_NEW_SOURCE_VERSION',reason:'New sequential source version with POST validation and restoration evidence.'};
}
