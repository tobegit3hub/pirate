# Pirate

Private docker registry with Web UI.

## Notice

The latest registry:0.8.1 doesn't support CORS, so pirate should not work.

## Usage

Run `docker run -d -e CORS_ORIGINS=[\'*\'] registry`

Or `docker run -d -e CORS_ORIGINS="'*'" registry`
