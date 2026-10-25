// App-specific mathematical/export checks added by later build runs.
import {readdirSync} from 'node:fs';
for (const name of readdirSync('scripts').filter(name => /^check-[a-z0-9-]+\.mjs$/.test(name) && !['check-extra.mjs', 'check-gps.mjs', 'check-perspective.mjs'].includes(name))) await import(`./${name}`);
