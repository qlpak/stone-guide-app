FROM node:18

WORKDIR /backend

COPY package.json package-lock.json ./

RUN npm install

COPY src/ ./src/

EXPOSE 5001

WORKDIR /backend/src

CMD ["npm", "run", "dev"]
