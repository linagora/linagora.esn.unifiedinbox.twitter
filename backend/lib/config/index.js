module.exports = dependencies => {
  const configRegistry = dependencies('esn-config').registry;
  const { createValidator } = dependencies('esn-config').validator.helper;
  const schema = {
    type: 'boolean'
  };

  return {
    register
  };

  function register() {
    configRegistry.registerToModule('linagora.esn.unifiedinbox', 'twitter.tweets', {
      rights: {
        padmin: 'rw',
        admin: 'rw',
        user: 'rw'
      },
      validator: createValidator(schema)
    });
  }
};
