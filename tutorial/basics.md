Podstawy
========

*Entropy* to framework ułatwiający tworzenie gier lub innych podobnych symulacji. Celowo używam słowa framework, a nie silnik, ponieważ w *Entropy* nie ma większości funkcjonalność jakich oczekujemy od silnika gry. Nie jest obecny żaden moduł renderujący, żaden silnik fizyczny, obsługa dźwięku itp. Taki stan rzeczy jest wynikiem świadomej decyzji projektowej. Celem *Entropy* jest danie użytkownikowi pełnej wolności w kwesti wyboru silnika graficznego, fizycznego, biblioteki dźwiękowj i innych komponentów, przy jednoczesnym wymuszeniu organizacji kodu i mechaniki gry w pewien specyficzny sposób. Ten sposób to tak zwany system encji (entity system). Jeżeli ten koncept jest Ci obcy, zachęcam do przeczytania tego artykułu: [Understanding Component-Entity-Systems](http://www.gamedev.net/page/resources/_/technical/game-programming/understanding-component-entity-systems-r3013).

Tworzenie gry przy wykorzystaniu *Entropy* przypomina trochę budowanie z klocków. Jednak zanim zaczniemy budować, musimy wcześniej nasze klocki stworzyć. W następnych akapitach zostaną opisane podstawowe elementy umożliwiające modelowanie gry.

## Encje

__Encja__ reprezentuje pojedynczą rzecz. Może to być cokolwiek. Kilka przykładów ze świata gier to: postać gracza, animacja, pocisk, element UI. Najważniejsze w encji jest to, że identyfikuje ona pojedynczy obiekt. Oczywiście może istnieć wiele encji tego samego rodzaju, ale każda z nich jest osobnym bytem. To, co sprawia, że poszczególne rodzaje encji różnią się od siebie, to komponenty, z których się składają. Przyjrzyjmy sie im bliżej, a do encji wrócimy później - łatwiej będzie je wtedy opisać.

## Komponenty

__Komponenty__ to najmniejsze jednostki budulcowe w całym systemie. Używane są do opisu encji. Każda encja może składać się z wielu komponentów. Jest jednak zasada, że w jednej encji nie może być dwóch komponentów tego samego typu. Przyjrzyjmy się teraz jak definiuje się komponenty w *Entropy*:

```javascript
Entropy.Engine.Component({
	name: "Position",
	initialize: function (x, y) {
		this.x = x;
		this.y = y;
	}
})

Entropy.Engine.Component({
	name: "Velocity",
	initialize: function (vx, vy) {
		this.vx = vx;
		this.vy = vy;
	}
})
```