## Reverse_pr0xy

This minimal nodejs reverse proxy can be used for any purpose you can think of, but this starter is for online privacy, so that no one can track you across the internet.

### Installation and Usage

1. clone the repository
2. run `git checkout master`
3. run `npm i` to install dependencies
4. add `.env` file into the root directory of the project and configure `USERNAME` and `PASSWORD` (those will be used to authenticate with your proxy server).
5. start the server by running `nodemon server` or `node server`
6. Now, you can use your proxy by configuring any machine you'd like to use you proxy `hostname`, `port` and the `USERNAME PASSWORD` from previous steps.

#### Note
- If you're deploying the server or forwarding it to the internet, then make sure to check `/docs` directory for guidance.

Made with 🕒 and 🛠️.
