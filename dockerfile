# Базовый образ
FROM node:14

# Создание директории приложения
WORKDIR /usr/src/app

# Копирование файлов package.json и package-lock.json
COPY package*.json ./

# Установка зависимостей
RUN npm install

# Копирование исходного кода приложения
COPY . .

RUN mkdir -p /app/avatars

# Компиляция TypeScript в JavaScript
RUN npx tsc --p 'tsconfig.json'

# Указание порта, который будет слушать приложение
EXPOSE 5000

# Запуск приложения
CMD [ "node", "dist/index.js" ]