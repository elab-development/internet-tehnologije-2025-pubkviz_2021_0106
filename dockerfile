# 1️⃣ Base image
FROM node:20-alpine

# 2️⃣ Set working directory
WORKDIR /app

# 3️⃣ Copy package files
COPY package.json package-lock.json ./

# 4️⃣ Install dependencies
RUN npm install

# 5️⃣ Copy rest of the project
COPY . .

# 6️⃣ Build Next app
RUN npm run build

# 7️⃣ Expose port
EXPOSE 3000

# 8️⃣ Start app
CMD ["npm", "start"]