# APSR Year 5 Computing App v2

This upgraded version adds three major features:

- Microsoft 365 login scaffolding using NextAuth
- Teacher analytics dashboard
- Scratch project integration inside each lesson

## What is live in this version

- Demo login for pupils and teachers
- Teacher analytics view using browser data plus demo class data
- Scratch editor links and starter project placeholders in every lesson
- Public Vercel deployment support

## What still needs setup for live Microsoft sign-in

To enable real Microsoft / Entra login in Vercel, add these environment variables:

- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `MICROSOFT_CLIENT_ID`
- `MICROSOFT_CLIENT_SECRET`
- `MICROSOFT_TENANT_ID`
- `NEXT_PUBLIC_ENABLE_MICROSOFT_LOGIN=true`
- `NEXT_PUBLIC_SCHOOL_DOMAIN=your-school-domain.com`
- `TEACHER_EMAILS=email1@domain.com,email2@domain.com`
- `NEXT_PUBLIC_TEACHER_CODE=APSR-Y5`

## Azure / Entra callback URL

In your Microsoft Entra app registration, add this redirect URI:

`https://your-domain/api/auth/callback/azure-ad`

For preview deployments, you can add the Vercel preview URL version as well.

## Scratch links

Each lesson currently includes:

- `scratchEditorUrl`
- `scratchStarterUrl`
- `scratchEmbedUrl`

Replace the placeholder URLs in `lib/lessons.ts` with your own school Scratch projects or studio links.

## Deploying the update

1. Replace the files in your GitHub repo with this updated project.
2. In Vercel, update the environment variables above.
3. Redeploy.

## Important limitation

The teacher analytics dashboard is still browser-based in this version. It shows:

- current-browser completion and quiz data
- a demo class table to prove the dashboard layout

To make analytics real across the school, the next stage would be connecting a database such as Supabase or Firebase.
