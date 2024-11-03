# Rakkas Edge+Origin

This is a proof of concept for splitting Rakkas routes between an edge and an origin server.

## How it works?

During development, it works as a normal Rakkas app.

It's build twice, one for the edge and one for the origin, determined by the `RAKKAS_BUILD_TYPE` environment variable. For the edge server build, pages in the `src/routes/(origin)` folder are disabled (through a [route.config.js](<./src/routes/(edge)/route.config.js>) file). Similarly, for the origin server build, `src/routes/(edge)` routes are disabled (again, through a [route.config.js](<./src/routes/(origin)/route.config.js>)).

The server builds that are put in the default `dist/server` directory are moved to `dist/edge` and `dist/origin` by a plugin after each build.

The edge build registers a `beforeNotFound` middleware to forward all requests that would cause a 404 to the origin server. Currently, the URL is hardcoded (`http://localhost:3001`) but it can be put in an environment variable instead. If we were to run the edge on Cloudflare, it could just become `fetch(ctx.url, ...)` (because fetches to the same origin from a CF worker go to the origin).

It also registers a `beforeAll` middleware to forward `(use|run)ServerSide(Query|Mutation)` requests, if their unique ID starts with `origin-`.

`pnpm start` starts both servers, the edge on port 3000, and the originon port 3001 (to match the hard-coded origin URL). And everything works.

## What doesn't work

Some things don't work well, or work in a non-ideal way. We need to implement some of those things in Rakkas itself:

1. We build the client twice
2. We forward all 404's to the origin.
3. We have to give every server-side function a unique ID and be careful about which one should run where
4. Even then, all server-side functions are compiled into both builds.

1 is easily solvable in Rakkas and not that big of a deal. 2 can also be solved in Rakkas without too much effort. 3 is annoying but can be managed.

But 4 is a bit of a dealbreaker. We should probably introduce a static option to `(use|run)ServerSide(Query|Mutation)` to control wether to include them in the build (since `route.config.js` files don't apply to them). That extra parameter could also be used to solve 3 above.

As a temporary workaround, we can add something like this to the beginning of every server-side function that should run on the origin (and vice versa):

```js
if (RAKKAS_BUILD_TYPE === "edge") {
  throw new Error("Shouldn't happen");
}
```

This will cause Vite to strip the treeshake of the function since `RAKKAS_BUILD_TYPE` is a static define.

## Conclusion

All in all, it looks promising.
