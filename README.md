### Typelingo for firefox

Inspired by the orignal https://github.com/Nowammm/TypeLingo project, this is a firefox extension for re-enabling typing input for typing in lerner's language, by modifying exercise data.

Icon obtained from the original project.

<img src="./demo.png" />

### Known issues:

- There will likely be no Chrom* support due to the lack of manifest v2 extension support, and manifest v3's lack of features. Use Firefox/Epiphany.
- Epiphany lost WebRequest api support a while ago and it has been in WIP state since, so this currently does not work with Epiphany/Gnome WEB. https://gitlab.gnome.org/GNOME/epiphany/-/issues/1795
- Learning language -> learner language exercice will wrongly display "Write this in (learning language)", due to how the translation exercice player is put together on Duolingo's webapp.
- If this was working for you previously but not anymore, Duolingo likely changed their exercise data format again.
- Like the original project, sometimes you might have to refresh the page for changes to be applies.
