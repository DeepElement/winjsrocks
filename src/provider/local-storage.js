import BaseProvider from "./base";

export default class extends BaseProvider {
  constructor(application) {
    super(application);

    this._repo = {
      /*
      fileName: {
        created: new Date(),
        data: content,
        lastModified: new Date()
      }
      */
    };
    application.logger.warn("LocalStorage Provider using in-memory strategy. Override with concrete impl to persist data between app sessions");
  }

  get(options, callback) {
    if (this._repo[options.fileName])
      return callback(null, this._repo[options.fileName]);
    if (callback)
      return callback('does-not-exist');
  }

  createOrUpdate(options, callback) {
    options.data = options.data || {};
    var subject = this._repo[options.fileName];
    if (!subject) {
      subject = {
        created: new Date()
      };
      this._repo[options.fileName] = subject;
    }
    subject.data = options.data;
    subject.lastModified = new Date();
    if (callback)
      return callback(null, subject);
  }

  del(options, callback) {
    if (this._repo[options.fileName]) {
      delete this._repo[options.fileName];
      this._repo[options.fileName] = null;
    }
    if (callback)
      return callback(null, true);
  }

  clear(options, callback) {
    this._repo = {};
    if (callback)
      return callback(null, true);
  }
};
