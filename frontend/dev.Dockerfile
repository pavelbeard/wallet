FROM ubuntu:latest
LABEL authors="pavelbeard"

ENTRYPOINT ["top", "-b"]