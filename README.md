# @rationale/text-inputs
Rationale is the Angular framework. @rationale/text-inputs is Rationale library. The text-inputs library is intended for processing of text data in html element inputs.

# Installation

 - Install package

    > npm install @rationale/text-inputs --save

 - Import TextInputsModule to your module, for example app.module.ts

    ` import { TextInputsModule } from '@rationale/text-inputs'; `

 - Import module to NgModule imports:

```
    @NgModule({
        ...
        imports: [
            BrowserModule,
            FormsModule,
            TextInputsModule
        ],
        ...
    })
```

## Directives

### RationaleInputIntDirective

    selector: [rationale-input-int]

| Decorator | Type   | Param   | Description |
|:--------- |:------ |:------- | :--- |
| Input     | number | default | The default value of empty input |
    
    
