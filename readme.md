# React Comment Form

Single post with comments using ReactJS. You can add, remove, flag comments and
vote on them.

I definitely need to check this code and refactor it. I’m pretty sure there
will be lots of stuff there to change. I kinda liked this project. It was one
of the more complex apps as it was the first time sibling components had to
communicate with each others. *Update: Several months later... Instead of using
refs I would [lift the state
up](https://facebook.github.io/react/docs/lifting-state-up.html) and would
store everything in the `Post` component.*

It would be great to sort these comments. Sort by:

- recent first
- oldest first
- highest rated first

It must be pretty easy and would be a great way to practice working with the
select tag.
