#!/usr/bin/env sh
set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
MODE="${MODE:-dev}"
PROJECT_NAME="${COMPOSE_PROJECT_NAME:-wheelchairuz}"

if docker compose version >/dev/null 2>&1; then
  COMPOSE="docker compose"
elif command -v docker-compose >/dev/null 2>&1; then
  COMPOSE="docker-compose"
else
  echo "Docker Compose topilmadi. Docker Compose v2 yoki docker-compose o'rnating." >&2
  exit 1
fi

compose_args() {
  if [ "$MODE" = "prod" ]; then
    if [ ! -f "$ROOT_DIR/.env.production" ]; then
      echo ".env.production topilmadi. Avval: cp deploy.env.example .env.production" >&2
      exit 1
    fi
    printf '%s\n' -p "$PROJECT_NAME" -f docker-compose.prod.yml --env-file .env.production
  else
    printf '%s\n' -p "$PROJECT_NAME" -f docker-compose.yml
  fi
}

run_compose() {
  set -- $(compose_args) "$@"
  # shellcheck disable=SC2086
  (cd "$ROOT_DIR" && $COMPOSE "$@")
}

cleanup_legacy_containers() {
  # Old builds used fixed container_name values outside Compose labels.
  # Remove only those legacy app containers; database volumes/containers are kept.
  for name in wheelchair_api wheelchair_web wheelchair_api_prod wheelchair_web_prod; do
    if docker ps -a --format '{{.Names}}' | grep -qx "$name"; then
      docker rm -f "$name" >/dev/null 2>&1 || true
    fi
  done
}

print_urls() {
  if [ "$MODE" = "prod" ]; then
    port="${FRONTEND_PUBLISH:-80}"
    echo "Sayt/Admin: http://localhost:${port}  (/admin)"
    echo "Backend: frontend nginx orqali /api/v1"
  else
    frontend_port="${FRONTEND_PUBLISH:-8080}"
    backend_port="${BACKEND_PUBLISH:-3002}"
    echo "Sayt:        http://localhost:${frontend_port}"
    echo "Admin panel: http://localhost:${frontend_port}/admin"
    echo "Backend API: http://localhost:${backend_port}/api/v1"
    echo "Swagger:     http://localhost:${backend_port}/api/docs"
  fi
}

usage() {
  cat <<'HELP'
wheelchair.uz boshqaruv skripti

Bitta buyruq bilan frontend + admin panel + backend (+ dev DB) boshqariladi.
Admin panel frontend ichida /admin route sifatida ishlaydi.

Ishlatish:
  ./wheelchair start       Build kerak bo'lsa build qilib, hammasini yoqadi
  ./wheelchair stop        Konteynerlarni to'xtatadi
  ./wheelchair down        Konteynerlarni o'chiradi (volume saqlanadi)
  ./wheelchair restart     Qayta yoqadi
  ./wheelchair rebuild     Toza rebuild qilib yoqadi
  ./wheelchair status      Holatni ko'rsatadi
  ./wheelchair logs        Barcha loglar
  ./wheelchair logs api    Faqat backend loglari
  ./wheelchair logs web    Faqat frontend/nginx loglari
  ./wheelchair logs db     Faqat PostgreSQL loglari (dev)
  ./wheelchair health      Backend/frontend health tekshiradi
  ./wheelchair urls        Ochiladigan URLlarni ko'rsatadi

Production:
  MODE=prod ./wheelchair start
  MODE=prod ./wheelchair restart
HELP
}

service_name() {
  case "${1:-}" in
    api|backend) echo backend ;;
    web|frontend|admin) echo frontend ;;
    db|postgres|database) echo postgres ;;
    "") echo "" ;;
    *) echo "$1" ;;
  esac
}

case "${1:-}" in
  start|up)
    cleanup_legacy_containers
    run_compose up -d --build --remove-orphans
    run_compose ps
    print_urls
    ;;
  stop)
    run_compose stop
    ;;
  down)
    run_compose down
    ;;
  restart)
    run_compose restart
    run_compose ps
    print_urls
    ;;
  rebuild|update)
    cleanup_legacy_containers
    run_compose up -d --build --remove-orphans
    run_compose ps
    print_urls
    ;;
  status|ps)
    run_compose ps
    ;;
  logs)
    svc="$(service_name "${2:-}")"
    if [ -n "$svc" ]; then
      run_compose logs -f --tail=160 "$svc"
    else
      run_compose logs -f --tail=160
    fi
    ;;
  health)
    run_compose ps
    if command -v curl >/dev/null 2>&1; then
      if [ "$MODE" = "dev" ]; then
        printf '\nBackend: '
        curl -fsS "http://127.0.0.1:${BACKEND_PUBLISH:-3002}/api/v1/health" || true
        printf '\nFrontend: '
        curl -fsSI "http://127.0.0.1:${FRONTEND_PUBLISH:-8080}/" | sed -n '1p' || true
      else
        printf '\nFrontend/API gateway: '
        curl -fsSI "http://127.0.0.1:${FRONTEND_PUBLISH:-80}/" | sed -n '1p' || true
      fi
      printf '\n'
    fi
    ;;
  urls)
    print_urls
    ;;
  help|-h|--help)
    usage
    ;;
  *)
    usage
    exit 1
    ;;
esac
