FROM node:12

ENV NPM_CONFIG_LOGLEVEL warn
ARG app_env
ENV APP_ENV $app_env
ARG server_protocol='http'
ARG server_host='sv-backend.svtz.ru'
ARG server_port=5000
ENV REACT_APP_SERVER_PROTOCOL $server_protocol
ENV REACT_APP_SERVER_HOST $server_host
ENV REACT_APP_SERVER_PORT $server_port

RUN mkdir -p /frontend
WORKDIR /frontend
COPY ./ ./

RUN npm install

CMD if [ ${APP_ENV} = production ]; \
	then \
	npm install -g http-server && \
	npm run build && \
	cd build && \
	hs -p 5050; \
	else \
	npm start; \
	fi

EXPOSE 5050