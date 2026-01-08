<img src="/images/blog/arm.png" alt="2 Ways You Can Easily Get Started With Azure Resource Manager (ARM) Templates" width="100%">


### 2 Ways You Can Easily Get Started With Azure Resource Manager (ARM) Templates

*The below was co-authored with <a href="https://www.linkedin.com/in/richard-barker-91808591/" target="_blank" title="Richard Barker">Richard Barker</a>, Software Developer at <a href="https://www.superdrug.com/" target="_blank" title="Superdrug">Superdrug</a>, and originally published on <a href="https://richard-barker.medium.com/2-ways-you-can-get-easily-started-with-azure-resource-manager-arm-templates-cbfeab5d3770" target="_blank" title="2 ways you can get easily started with Azure Resource Manager (ARM) Templates">Medium</a>.*

#### Introduction

Azure Resource Templates allow you to automate deployments and use the practice of infrastructure as code. I wanted to share with you 2 different ways you can get started quickly with ARM templates.

#### Use the Azure portal to get started

The first way you can get started is to use the Azure portal. We’re going to create a template that will create a storage account.

Firstly you need to create the resources on Azure. From here, you can select the resources through the portal. Click on the ellipsis (the three dots in the top right hand corner) and then select export template.

![2 Ways You Can Easily Get Started With Azure Resource Manager (ARM) Templates](/images/blog/arm-1.png)

You can copy the json into your template, which will give you the required code to deploy those resources wherever you want.

![2 Ways You Can Easily Get Started With Azure Resource Manager (ARM) Templates](/images/blog/arm-2.png)

#### Azure GitHub Repo

The other way I suggest you get started with ARM templates is to use the Azure GitHub ARM templates as a base for your particular scenario and then build on top of that.

<a href="https://github.com/Azure/azure-quickstart-templates" target="_blank" title="azure-quickstart-templates">https://github.com/Azure/azure-quickstart-templates</a>

Just search for your desired resource and then copy that json into your own files and change it for your own needs.

#### Conclusion

In this post I wanted to share with you how you can quickly get started with ARM templates with minimal time and effort spent. There are lots of good resources out there that can give you a lot more detailed information on ARM templates, if you wish to dive deeper into the subject. The below link is a good place to start.

<a href="https://docs.microsoft.com/en-us/azure/azure-resource-manager/templates/overview" target="_blank" title="What are ARM templates?">https://docs.microsoft.com/en-us/azure/azure-resource-manager/templates/overview</a>