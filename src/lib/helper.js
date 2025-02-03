import {
    verifyRequest,
    fetchVerificationKeys,
} from '@copilot-extensions/preview-sdk';

async function verifySignature(req) {

    const payload = req.rawBody;

    const github_public_key_identifier = req.get("github-public-key-identifier");
    const github_public_key_signature = req.get("github-public-key-signature");

    const tokenForUser = req.get("X-GitHub-Token");

    const github_public_keys = await fetchVerificationKeys({
        token: tokenForUser
    });

    const public_key = github_public_keys.keys.find(key => key.key_identifier === github_public_key_identifier);
    if (!public_key) {
        throw new Error("Invalid public key identifier");
    }

    return await verifyRequest(payload, github_public_key_signature, public_key.key);
}

export { verifySignature };