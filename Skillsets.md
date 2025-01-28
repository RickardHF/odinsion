# Skillsets

Here are provided the content of the definitions of the skillsets that are used in the Odin extension. The skillsets are used to handle different types of intents.

# Specific Stanzas

__Name__: Specific_Stanza

__Inference description__:
This skill should be called when a user ask for a specific stanza. The user needs to provide a number and we should return the specific stanza given the number

__URL__: 
\<URL\>/skillset/stanza

__Parameters__:
```json
{
  "type": "object",
  "properties": {
    "number": {
      "type": "number",
      "description": "This is the number of the stanza the user wants"
    }
  }
}
```

# Greeting
__Name__: Greeting

__Inference description__:
If the user wants a personalized greeting from a specific god the model should provide that

__URL__: 
\<URL\>/skillset/greeting

__Parameters__:
```json
{
  "type": "object",
  "properties": {
    "god": {
      "type": "string",
      "description": "This is the god the user wants to get a greeting from"
    },
    "type": {
      "type": "string",
      "description": "This is the type of greeting the user wants to get",
      "enum": ["greeting", "blessing", "curse", "insult", "romantic"]
    },
    "to_himself": {
      "type": "boolean",
      "description": "This is a flag to indicate if the user wants to get a greeting to himself or someone else"
    },
    "recipient": {
      "type": "string",
      "description": "This is the name of the recipient of the greeting"
    }
  }
}
```
