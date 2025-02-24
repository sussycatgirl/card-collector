FROM node:20
WORKDIR /app
COPY . /app
RUN npm install --frozen-lockfile

CMD ["npm", "run", "start"]
