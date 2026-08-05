const DotEnv = require('dotenv');
const Enzyme = require('enzyme');
const Adapter = require('@wojtekmaj/enzyme-adapter-react-17');

DotEnv.config({ path: '.env.test' });
Enzyme.configure({
  adapter: new Adapter()
});
