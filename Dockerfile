FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine AS backend-builder
WORKDIR /app
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./

FROM node:20-alpine
WORKDIR /app
# Copy backend
COPY --from=backend-builder /app ./
# Copy frontend dist to backend public folder for static serving
COPY --from=frontend-builder /app/dist ./public
EXPOSE 5000
CMD ["npm", "start"]
