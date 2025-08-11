FROM fedora:42
RUN dnf install -y npm
RUN npm install --global web-ext

