# make-gist

This is a small CLI tool that generates a Github gist by collecting files from a particular directory and making a request to the Github API. Only creates secret gists.

**Which files are included?** This will include _any_ file present in the directory specificed. It _does not_ include any directories or subdirectories, and ignores specific files. Here is a list of ignored files:

```
package-lock.json
yarn.lock
.DS_Store
```

### Install

```
npm install make-gist -g
```

**Authorization**

Requires a `MAKE_GIST_TOKEN` environment variable present, which should be a Github OAuth token with the `gist` scope. This can be saved in your bash profile.

![](https://user-images.githubusercontent.com/1943001/48571072-d3d03980-e8ba-11e8-9fe3-e120a23ea526.png)

### Usage

```
make-gist <directory> -d|--description
```

Example

```shell
# basic usage (will run in cwd)
make-gist

# point to directory and name the gist
make-gist path/to/project --description "my neat project"

# run with token in process
MAKE_GIST_TOKEN=<token> make-gist
```

### Test

```
npm test
```
