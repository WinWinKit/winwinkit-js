
### Update schema

From remote:
```
npx openapi-typescript https://api.winwinkit.com/openapi -o ./src/types/schema.d.ts
```

From local file:
```
npx openapi-typescript ./src/openapi.yaml -o ./src/types/schema.d.ts
```

### Publish

1. Update the package version.
2. Run `npm run publish`.