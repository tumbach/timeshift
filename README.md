# TimeShift

TimeShift is a Node.js application that allows you to delay and stream an Icecast radio source with different delays.

**NOTE: It is a proof-of-concept. Do not use in production. Feel free to report bugs or suggest features.**

### Features

- Delays the audio stream from an Icecast source and sends it back after a specified amount of time (e.g. 1/2/3 hours, etc.).
- Supports output with different delays.
- Easy to use with Docker and Docker Compose.

### Usage

Requires `libshout`. You could try to install or compile it, but recommend you to use Docker, especially on Windows platforms.
```shell
git clone https://github.com/tumbach/timeshift.git
cd timeshift
cp .env.example .env
docker-compose up -d
```

### TODO

- [ ] Error handling
- [ ] Reconnect to streams

### How to improve this app? ChatGPT answers!

Here are some ways:

1. Add support for multiple Icecast sources and outputs.
2. Implement a user-friendly interface for managing the app, such as a web-based dashboard.
3. Add a feature to adjust the delay time on-the-fly without restarting the app.
4. Allow users to save and load preset configurations.
5. Add support for different audio formats besides MP3 or OGG.
6. Implement real-time audio processing, such as audio filtering and equalization.
7. Add support for live recording and archiving of the audio streams.
8. Implement error handling and logging to make it more robust and easier to debug.
9. Add security features, such as authentication and encryption, to prevent unauthorized access.

These are just some of the ways that this app can be improved.
The possibilities are endless, and it really depends on the requirements and goals of the project.