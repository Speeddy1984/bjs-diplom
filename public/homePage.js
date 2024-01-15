'use strict';

const logoutButton = new LogoutButton();
logoutButton.action = data => ApiConnector.logout(response => {
	if (response['success'] === true) {
		location.reload();
	} else {
		console.log('ошибка выхода');
	}
});

ApiConnector.current(response => {
	if (response['success'] === true) {
		ProfileWidget.showProfile(response['data']);
	} else {
		console.log('ошибка запроса');
	}
});

const ratesBoard = new RatesBoard();

function getExchangeRate() {
	ApiConnector.getStocks(response => {
		if (response['success'] === true) {
			ratesBoard.clearTable();
			ratesBoard.fillTable(response['data']);
		} else {
			console.log('ошибка запроса');
		}
	});
}
getExchangeRate();
setInterval(() => getExchangeRate(), 300000);

const moneyManager = new MoneyManager();
moneyManager.addMoneyCallback = data => ApiConnector.addMoney(data, response => {
	if (response['success'] === true) {
		ProfileWidget.showProfile(response['data']);
		moneyManager.setMessage(response['success'], 'Пополнение выполнено успешно');
	} else {
		moneyManager.setMessage(response['success'], response['error'])
	}
});

moneyManager.conversionMoneyCallback = data => ApiConnector.convertMoney(data, response => {
	if (response['success'] === true) {
		ProfileWidget.showProfile(response['data']);
		moneyManager.setMessage(response['success'], 'Конвертация выполнена успешно');
	} else {
		moneyManager.setMessage(response['success'], response['error'])
	}
});

moneyManager.sendMoneyCallback = data => ApiConnector.transferMoney(data, response => {
	if (response['success'] === true) {
		ProfileWidget.showProfile(response['data']);
		moneyManager.setMessage(response['success'], 'Перевод выполнен успешно');
	} else {
		moneyManager.setMessage(response['success'], response['error'])
	}
});

const favoritesWidget = new FavoritesWidget();
ApiConnector.getFavorites(response => {
	if (response['success'] === true) {
		favoritesWidget.clearTable();
		favoritesWidget.fillTable(response['data']);
		moneyManager.updateUsersList(response['data']);
	} else {
		console.log(response['error']);
	}
});

favoritesWidget.addUserCallback = data => ApiConnector.addUserToFavorites(data, response => {
	if (response['success'] === true) {
		favoritesWidget.clearTable();
		favoritesWidget.fillTable(response['data']);
		moneyManager.updateUsersList(response['data']);
		favoritesWidget.setMessage(response['success'], 'Пользователь добавлен в избранное');
	} else {
		favoritesWidget.setMessage(response['success'], response['error'])
	}
});

favoritesWidget.removeUserCallback = data => ApiConnector.removeUserFromFavorites(data, response => {
	console.log(response);
	console.log(data);
	if (response['success'] === true) {
		favoritesWidget.clearTable();
		favoritesWidget.fillTable(response['data']);
		moneyManager.updateUsersList(response['data']);
		favoritesWidget.setMessage(response['success'], 'Пользователь удален из избранного');
	} else {
		favoritesWidget.setMessage(response['success'], response['error'])
	}
});