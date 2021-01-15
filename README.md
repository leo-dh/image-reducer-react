# Image Reducer Frontend

> Simple frontend browser application to bulk compress images either through
> the browser or using a backend server.

[Insert Image Here]

## Credits

- Icons were obtained from various places, mainly HeroIcons and Ant Design.
- Codecs were obtained from the [Squoosh](https://github.com/GoogleChromeLabs/squoosh) project.

## Issues

- There are currently some edge cases where the file might end up larger than
  the initial size. This happens to due to the additional overhead from
  converting from `ImageData` to `Blob` using JavaScript. In cases, one might
  be better off using the server option.
