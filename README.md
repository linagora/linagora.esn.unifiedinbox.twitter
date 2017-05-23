# linagora.esn.unifiedinbox.twitter

twitter extension for OpenPaaS ESN inbox module.

## Install

*Note: The following instructions assumes that you have already installed OpenPaaS ESN in the path referenced by $ESN below.*

While waiting for a npm-based dependency injection handler, you have to install this twitter module in OpenPaaS ESN like this:

**1. Clone linagora.esn.unifiedinbox.twitter**

Clone the `linagora.esn.unifiedinbox.twitter` repository.

```
git clone https://ci.open-paas.org/stash/scm/om/linagora.esn.unifiedinbox.twitter.git
```

Go inside OpenPaaS ESN repository:

```
cd $ESN
npm install
npm link
```

Go inside `linagora.esn.unifiedinbox.twitter` folder and run:

```
npm link linagora-rse
npm install
```

**2. Add the module in the OpenPaaS ESN configuration file**

You must add "linagora.esn.unifiedinbox.twitter" in the modules section in `$ESN/config/default.NODE_ENV.json`. NODE_ENV is the environment variable used to define if the node application is running in 'production' or in 'development' (the default environment is 'development').
Copy the 'modules' array from `$ESN/config/default.json` into `$ESN/config/default.NODE_ENV.json` (`$ESN/config/default.development.json` or `$ESN/config/default.production.json`) and add the "linagora.esn.unifiedinbox.twitter" item:

```
"modules": [
  "linagora.esn.core.webserver",
  "linagora.esn.core.wsserver",
  "linagora.esn.unifiedinbox.twitter"
],
```

**3. Create symbolic link**

The module must be available in the `$ESN/modules` folder:

```
cd $ESN
ln -s path_to_twitter_module modules/linagora.esn.unifiedinbox.twitter
```

## Enable

In order to use this module, it must be activated and user must link his twitter account:

1. Activate the twitter events in the linagora.esn.unifiedinbox configuration by setting the feature flip flag `twitter.tweets` to `true`
2. The user must link his Twitter account from the accounts page on http://HOST:PORT/#/controlcenter/accounts

## Run

Once installed, you can start OpenPaaS ESN as usual. The Twitter module is now injecting your twitter data in the Inbox module if you have linked your twitter account with OP.
