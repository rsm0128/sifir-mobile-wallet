import base64 from 'base-64';

const validatedTokenHash = tokenHash => {
  if (!tokenHash || !tokenHash.length) {
    return {};
  }
  try {
    const json_string = base64.decode(tokenHash);
    const decodedToken = JSON.parse(json_string);
    const {key, token: tokenJSONString} = decodedToken;
    const token = JSON.parse(tokenJSONString);
    return {key, token};
  } catch (err) {
    return {};
  }
};

const nodeRegx = new RegExp(/^([A-Za-z0-9]{66})/);
const isValidLnNodeId = node => {
  return nodeRegx.test(node);
};

export {validatedTokenHash, isValidLnNodeId};
