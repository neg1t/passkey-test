# Solution Factory React Template

## Информация

#### Шаблон React-приложения.

- React `v18.2.0`
- React Router Dom `v6.4.2`
- Typescript `v5.3.3`
- Ant Design `v5.12.8`
- effector `v23.1.0`
- Архитектура основана на [Feature-Sliced Design]("https://feature-sliced.design")

## Установка

#### После установки зависимостей:

`yarn | npm install`

#### Необходимо подключить husky выполнив команду:

`yarn prepare | npm run prepare`

_P.S. husky используется для автоматического версионирования при пуше. В данном шаблоне применяется [Семантическое версионирование](https://semver.org/lang/ru/) и [Соглашение о коммитах (Conventional Commits)](https://www.conventionalcommits.org/ru/v1.0.0/)_

_P.P.S. для настройки или ознакомления используем [version-bump.js](./version-bump.js)_

_P.P.P.S при пуше в репу возникают ошибки, пока что проблема не решена, но коммиты отправляются_

## После установки

- Не забудь поменять title в [index.html](./index.html?plain=1#React.Template)
- Если не используется identity [auth.ts](./src/entities/auth.ts) не нужен
- Изменить тему для фигмы - [конфиг](./src/shared/config/theme.ts)
- Табы для layout - [tabs](./src/entities/menu/model/menu.ts#allTabs)
- Роуты - [routes](./src/widgets/Router/model/routes.tsx#routes)
- Изменить layout под дизайн - [layout](./src/widgets/Router/index.tsx#Layoutstyle)
