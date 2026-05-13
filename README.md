# Cloud Bakery Game

브라우저에서 바로 실행되는 캐주얼 숫자 퍼즐 게임입니다.

## 실행 방법

로컬에서 확인할 때는 정적 서버로 실행합니다.

```powershell
py -m http.server 64777 --bind 127.0.0.1
```

그 다음 브라우저에서 엽니다.

```text
http://127.0.0.1:64777/index.html
```

## GitHub Pages 배포

이 프로젝트는 별도 빌드 과정이 없는 정적 웹 게임입니다.

1. GitHub 저장소에 이 폴더를 푸시합니다.
2. GitHub 저장소의 `Settings` -> `Pages`로 이동합니다.
3. `Build and deployment`에서 `Deploy from a branch`를 선택합니다.
4. Branch를 `main`, folder를 `/ (root)`로 선택하고 저장합니다.

잠시 뒤 아래 형식의 링크로 게임을 공유할 수 있습니다.

```text
https://<github-username>.github.io/<repository-name>/
```
