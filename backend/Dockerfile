FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN mkdir -p uploads/barbers uploads/products
EXPOSE 5000
CMD ["npm", "start"]
