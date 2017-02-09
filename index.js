class Post extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(data) {
    this.refs.comments.addComment(data);
  }
  render() {
    const post = 'Synth cardigan street art fam keffiyeh, squid pinterest. Man bun keffiyeh leggings, green juice edison bulb salvia lomo humblebrag distillery ennui williamsburg swag 8-bit intelligentsia listicle.\n\nCopper mug 16-bit pug art party fanny pack. Activated charcoal narwhal butcher chicharrones.\n\nVinyl deep v copper mug bitters cray, subway tile narwhal vaporware mlkshk air plant freegan glossier bespoke. Vice retro photo booth sartorial, meggings hot chicken synth gastropub shabby chic. Knausgaard pabst truffaut marfa chicharrones.\n\n---';
    marked.setOptions({
      sanitize: true,
      smartypants: true,
    });
    const markdown = marked(post);

    return (
      <div>
        <header>
          <div className="container">
            <h1>ReactJS Comment App</h1>
          </div>
        </header>
        <div className="container">
          <section dangerouslySetInnerHTML={{__html: markdown}} />
          <h2>Leave a Comment</h2>
          <CommentForm postID={57} handleSubmit={this.handleSubmit} />
          <Comments ref="comments" />
        </div>
      </div>
    );
  }
}

class Comments extends React.Component {
  constructor() {
    super();
    this.state = {
      comments: [],
    }
    this.flagComment = this.flagComment.bind(this);
    this.handleVotes = this.handleVotes.bind(this);
  }
  componentDidMount() {
    let comments = localStorage.getItem('zsComments');
    comments = JSON.parse(comments) || [{
      id: 11,
      postID: 57,
      author: {
        name: 'Peter',
        email: 'fakemail@gmail.com',
        avatar: '/images/man-1.svg',
      },
      comment: 'Unicorn tumeric kale chips, fashion axe iceland sartorial blue bottle pinterest. Artisan gentrify *umami edison bulb*, austin locavore echo park farm-to-table single-origin coffee pabst green juice fashion axe twee yuccie listicle.\n\nWilliamsburg __8-bit lomo venmo__, you probably haven\'t heard of them semiotics leggings microdosing viral helvetica copper mug narwhal readymade.',
      date: new Date(new Date().getTime() - 2*6e4),
      votes: {
        like: 5,
        dislike: 2,
      },
      flagged: false,
    }, {
      id: 10,
      postID: 57,
      author: {
        name: 'Levy',
        email: 'levy@starbucks.com',
        avatar: '/images/man-2.svg',
      },
      comment: 'Bitters neutra hoodie cray, pabst pug ugh austin small batch irony food truck synth semiotics franzen woke. Pitchfork etsy wayfarers cred. Fixie live-edge keffiyeh freegan, knausgaard +1 butcher. DIY biodiesel four dollar toast aesthetic squid health goth, vegan la croix fashion axe affogato deep v vice whatever.',
      date: new Date(new Date().getTime() - 5*6e4),
      votes: {
        like: 7,
        dislike: 1,
      },
      flagged: false,
    }];

    this.setState({ comments });
  }
  componentDidUpdate() {
    localStorage.setItem('zsComments', JSON.stringify(this.state.comments));
  }
  flagComment(id) {
    if (!id) { return; }

    this.setState(state => {
      let comments = state.comments.slice();
      comments = comments.map(comment => {
        if (comment.id === id) {
          return Object.assign({}, comment, {
            flagged: !comment.flagged,
          });
        }
        return comment;
      });
      return {
        comments,
      };
    });
  }
  handleVotes(id, type) {
    if (!id || !type) {
      return;
    }
    this.setState(state => {
      let comments = state.comments.slice();
      comments = comments.map(comment => {
        if (comment.id === id) {
          const votes = Object.assign({}, comment.votes, {
            [type]: comment.votes[type] + 1,
          });
          return Object.assign({}, comment, {
            votes,
          });
        }
        return comment;
      });
      return {
        comments,
      };
    });
  }
  addComment(comment) {
    if (!comment) { return; }
    this.setState(state => {
      let comments = state.comments.slice();
      comments.unshift(comment);

      return { comments };
    });
  }
  deleteComment(id) {
    if (!id) { return; }
    this.setState(state => {
      const comments = state.comments.filter(comment => comment.id !== id);

      return { comments };
    });
  }
  render() {
    const listComments = this.state.comments.map(comment => {
      const flagged = 'comment' + (comment.flagged ? ' flagged'  : '');
      return (
        <li
          key={comment.id}
          className={flagged}
          id={`comment-${comment.id}`}
          >
          <Author
            author={comment.author}
            date={comment.date}
          />
          <Comment comment={comment.comment} />
          <footer>
            <Votes
              id={comment.id}
              votes={comment.votes}
              handleVotes={this.handleVotes}
            />
            <button
              className="delete"
              onClick={() => this.deleteComment(comment.id)}
            >Delete</button>
            <Report
              id={comment.id}
              flagged={comment.flagged}
              handleFlag={this.flagComment}
            />
          </footer>
        </li>
      );
    });
    return (
      <ul className="comments">
        {listComments}
      </ul>
    );
  }
}

const Comment = (props) => {
  marked.setOptions({
    sanitize: true,
    smartypants: true,
  });
  const markdown = marked(props.comment);
  return (
    <div
      className="comment-body"
      dangerouslySetInnerHTML={{__html: markdown}}
    />
  );
}

Comment.propTypes = {
  comment: React.PropTypes.string.isRequired,
};

const Author = (props) => (
  <div className="author">
    <img src={props.author.avatar} />
    <div className="author-header">
      <p className="name">{props.author.name}</p>
      <p className="date">Posted on {props.date.toLocaleString()}</p>
    </div>
  </div>
);

Author.propTypes = {
  date: React.PropTypes.string.isRequired,
  author: React.PropTypes.shape({
    name: React.PropTypes.string.isRequired,
    avatar: React.PropTypes.string.isRequired,
  }).isRequired,
};

const Votes = (props) => {
  function handleVotes(event) {
    props.handleVotes(props.id, event.target.className);
  }
  return (
    <div className="votes">
      <span onClick={handleVotes} className="like">{props.votes.like}</span>
      <span onClick={handleVotes} className="dislike">{props.votes.dislike}</span>
    </div>
  );
};

Votes.propTypes = {
  id: React.PropTypes.number.isRequired,
  votes: React.PropTypes.objectOf(React.PropTypes.number).isRequired,
  handleVotes: React.PropTypes.func.isRequired,
};

const Report = (props) => {
  function handleFlag() {
    props.handleFlag(props.id);
  }
  if (props.flagged) {
    return (<button onClick={handleFlag}>Not Spam</button>);
  }
  return (<button onClick={handleFlag}>Spam</button>);
}

Report.propTypes = {
  id: React.PropTypes.number.isRequired,
  flagged: React.PropTypes.bool.isRequired,
  handleFlag: React.PropTypes.func.isRequired,
};

class CommentForm extends React.Component {
  constructor(props) {
    super(props);
    // this is ugly...
    const comments = JSON.parse(localStorage.getItem('zsComments'));
    let lastCommentId = 0;
    if (comments && comments.length > 0) {
      lastCommentId = comments.map(x => x.id)
        .reduce((a, b) => (a > b) ? a : b);
    } else {
      lastCommentId = 11;
    }
    this.state = {
      postID: props.postID,
      name: 'Jason Andrews',
      email: 'jason89@example.com',
      comment: 'I love your post.',
      lastCommentId,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }
  handleSubmit(event) {
    event.preventDefault();
    this.setState(state => ({
      lastCommentId: state.lastCommentId + 1,
    }));
    const comment = {
      id: this.state.lastCommentId + 1,
      postID: this.state.postID,
      author: {
        name: this.state.name,
        email: this.state.email,
        avatar: '/images/man-3.svg',
      },
      comment: this.state.comment,
      date: new Date().toISOString(),
      votes: {
        like: 0,
        dislike: 0,
      },
      flagged: false,
    };
    this.props.handleSubmit(comment);
  }
  render() {
    return (
      <form
        onChange={this.handleChange}
        onSubmit={this.handleSubmit}
      >
        <div className="inputs">
          <input
            type="text"
            name="name"
            required
            placeholder="Your name"
            defaultValue={this.state.name}
          />
          <input
            type="email"
            name="email"
            required
            placeholder="Your email"
            defaultValue={this.state.email}
          />
        </div>
        <textarea
          name="comment"
          required
          rows="5"
          placeholder="Type your comment..."
          defaultValue={this.state.comment}
        />
        <input type="submit" value="Post comment" />
      </form>
    );
  }
}

CommentForm.propTypes = {
  postID: React.PropTypes.number.isRequired,
  handleSubmit: React.PropTypes.func.isRequired,
};

ReactDOM.render(<Post />, document.getElementById('post'));
