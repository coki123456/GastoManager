# Build Stage
FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Add ARGs for build time variables
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

# Set them as ENV variables so Vite can see them
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

RUN npm run build

# Production Stage
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
