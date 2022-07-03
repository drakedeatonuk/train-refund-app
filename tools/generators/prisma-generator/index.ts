import {
  formatFiles,
  generateFiles,
  joinPathFragments,
  names,
  Tree
} from '@nrwl/devkit';

interface GeneratorOptions {
  name: string;
  provider: string;
  connectionString: string;
  dbUser: string,
  dbPassword: string,
  dbPort: string,
  dbDatabase: string,
  dbSchema: string
}

export default async function (tree: Tree, schema: GeneratorOptions) {
  const { name, className, constantName } = names(schema.name)
  const { dbUser, dbPassword, dbPort, dbDatabase, dbSchema } = schema;

  generateFiles(
    tree,
    joinPathFragments(__dirname, './template'),
    'libs/prisma-clients',
    {
      dbType: schema.provider,
      tmpl: '',
      name,
      className,
      constantName,
      outputLocation: `../../../../node_modules/.prisma/${name}-client`
    }
  )

  console.log(joinPathFragments(__dirname, './template'))

  // Write .env
  if ( !tree.exists('.env') ) {
    tree.write('.env', '')
  }

  let envContents = tree.read('.env').toString()
  envContents += `${constantName}_DATABASE_URL=postgresql://${dbUser}:${dbPassword}@localhost:${dbPort}/${dbDatabase}?schema=${dbSchema}\n`
  tree.write('.env', envContents)

  // Write export
  if ( !tree.exists('libs/prisma-clients/index.ts') ) {
    tree.write('libs/prisma-clients/index.ts', '')
  }

  let exportsConents = tree.read('libs/prisma-clients/index.ts').toString()
  exportsConents += `export { ${className}Client } from './${name}';\n`
  tree.write('libs/prisma-clients/index.ts', exportsConents)

  await formatFiles(tree)
}
