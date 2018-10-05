import { Prisma } from 'data/utils';

import { create } from './data';

export { create } from './data';

let db: Prisma.Prisma;
let context: ServerContext;

interface Options {
  user?: Partial<Prisma.User>;
  language?: Prisma.LanguageCode;
  clear?: string[];
  create?: any;
}

async function clear(options: Options) {
  if (options.clear) {
    for (let key of options.clear) {
      const pluralKey = 'deleteMany' + (key + (key[key.length - 1] === 's' ? 'es' : 's'));
      await (db.mutation as any)[pluralKey]({});
    }
  }
}

export function withMock<T>(object: T, property: keyof T, impl: (mockedObject: T) => void) {
  const original = object[property];
  object[property] = jest.fn() as any;
  try {
    impl(object);
  }
  catch (ex) {
    throw ex;
  }
  finally {
    object[property] = original;
  }
}

export async function testMockedResolver<T>(object: T, property: keyof T, impl: (args: any, context: any, info: any) => any) {
  const original = object[property];
  object[property] = jest.fn() as any;

  const input = {};
  const args = { input };
  const ctx: any = {};
  const info: any = {};

  (object[property] as any).mockReturnValue(1000);

  try {
    const result = await impl(args, ctx, info);

    expect(object[property]).toHaveBeenCalledWith(ctx, input, info);
    expect(result).toEqual(1000);
  }
  catch (ex) {
    throw ex;
  }
  finally {
    object[property] = original;
  }


}

export async function its(
  name: string,
  options: Options = { language: 'EN' },
  impl: (context: ServerContext, user?: Prisma.User) => void
) {
  // init db
  if (!db) {
    db = new Prisma.Prisma({
      endpoint: 'http://localhost:4466/test',
      debug: true
      // secret: 'my_secret123', // only needed if specified in `database/prisma.yml`
    });
  }

  // init context
  if (!context) {
    context = {
      db,
      request: {},
      response: {},
      userId: null,
      i18n: null,
      cache: null
    };
  }

  // call the original it
  it(name, async () => {
    await clear(options);

    if (options.user) {
      await db.mutation.deleteManyUsers({});

      const user = await create.user(context, options.user);

      context.getUser = async () => user as any;
      context.userId = user.id;
    }

    const result = await impl(context);
    await clear(options);

    return result;
  });
}
