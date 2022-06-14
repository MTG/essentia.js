# Music autotagging with Discogs Effnet
Demo showing realtime music autotagging based on the Discogs taxonomy (400 subgenre tags). 

## To start project locally (Dev version):
- `cd server`
- `npm run dev`
- `cd ../views`
- `npm run dev`

## To build for deployment:
- `cd views`
- `npm run build`
- `docker build -t discogs-demo:latest .`
- `docker run --rm -it -p 8000:8000 discogs-demo:latest node server.js`
