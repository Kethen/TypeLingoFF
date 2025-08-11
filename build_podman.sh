set -xe

IMAGE_TAG="typelingoff"

if [ "$REBUILD_IMAGE" == "true" ]
then
	podman image remove -f $IMAGE_TAG
fi

if ! podman image exists $IMAGE_TAG
then
	podman image build -f Dockerfile -t $IMAGE_TAG
fi

podman run --rm -it \
	-v ./:/workdir \
	-w /workdir \
	--entrypoint /bin/bash \
	$IMAGE_TAG \
	-c '
	web-ext build -s src --overwrite-dest
'
