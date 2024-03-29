# CLI for updating Books on my site

My [site](https://steveostudios.com) runs on Eleventy, and there are some things that I do regularly that I thought would be helpful to update via a command-line instead of by hand. Plus I wanted to write a CLI tool.

As I have been reading more and updating my site almost daily. This CLI make updating the site faster.

The books data is held in Airtable. This updates that table.

## Installation

Not quite sure yet. From this git directory I just ran `npm i -g`. Not sure if I am going to make this a legit package or not.

## Usage

```shell
$ book
```

From here it will ask you what you did.

### Bought a book

```shell
$ book new
```

```shell
$ book n
```

This doesn't yet _start_ a book, just get it on the proverbial nightstand! It asks for an ISBN number. From here it will attempt to grab a URL for the image, all of the necessary data and add the book.

### Start a book

```shell
$ book start
```

```shell
$ book s
```

I've picked up a new book, cracked it open and started a few pages.

The will look at all of the books I have not yet started, move it to the "currently reading" and note the date and page number.

### Read a book

```shell
$ book read
```

```shell
$ book r
```

This will look at all of the books I am in the middle of and ask which book and where I'm at.

### Finish a book

```shell
$ book finish
```

```shell
$ book f
```

This will move a book to the "finished" state, and log the necessary things. Next I need it to do some sort of happy dance!

### Git log

```shell
$ book log
```

### Deploy

```shell
$ book deploy
```

This will trigger a deploy on Netlify

## Todo

- [] hook to update GoodReads?
- [] netlify notification
- [] error checking for each step
