---


layout: bt_wiki
title: Cheat Sheet
category: internal
publish: false
weight:  700
parent:  none
---



{{% gsSummary %}}

# Text

{: .table .table-bordered}
| **Example** | **Markdown** |
| This is an *emphasised* text. | This is an \*emphasised\* text. |
| This is a **bold** text. | This is a \*\*bold\*\* text.  |
| This is a `monospaced` text | This is a \`monospaced\` text |

# Links

{: .table .table-bordered}
| **Description** | **Markdown** | **Output** |
| Link to external site | \[GigaSpaces\]\(http://www.gigaspaces.com\) | [GigaSpaces](http://www.gigaspaces.com) |
| Link to page in same folder | \[Directory Structure\]\(file-structure.html\) | [Directory Structure](file-structure.html) |
| Set anchor | { % anchor anchorname %} (no space between '{' and '%': had trouble escaping this..)| {% anchor anchorname %}[A link to the anchor](#anchorname) |


# Images

{: .table .table-bordered}
| **Description** | **Markdown** |
| Shows an image (the text will be the image's `alt`) | \!\[image-alt-description-here\]\(image-link-here\) |

# Panels

<table border="1" cellpadding="10">
<colgroup><col span="1" style="width: 55%;"/><col span="1" style="width: 45%;"/></colgroup>
<tr><th> Example </th><th> Markdown </th></tr>
<tr><td>
{{< gsHighlight  python linenos  >}}
class Hangman(object):

    def __init__(self, word, num_attempts):
        self.word = word
        self.num_attempts = num_attempts
        self.attempts_left = num_attempts
        self.status_arr = ['?' for _ in word]
{{< /gsHighlight >}}<pre>
{{< gsHighlight  python linenos  >}}
class Hangman(object):

    def __init__(self, word, num_attempts):
        self.word = word
        self.num_attempts = num_attempts
        self.attempts_left = num_attempts
        self.status_arr = ['?' for _ in word]
{{< /gsHighlight >}}

</pre>
Languages: yaml python
{%endraw%}</td></tr>
<tr><td>{{% gsTip title="Foo" %}}this is a Tip panel {{% /gsTip %}}</td></tr>
<tr><td>{{% gsInfo title="Foo" %}}this is an Information panel {{% /gsInfo %}}</td></tr>
<tr><td>{{% gsNote title="Foo" %}}this is a Note panel {{% /gsNote %}}</td></tr>
<tr><td>{{% gsWarning title="Foo" %}}this is a Warning panel {{% /gsWarning %}}</td></tr>
<tr><td>{%quote%}This is a quote{%endquote%}</td><td>{%raw%} {%quote%}This is a quote{%endquote%} {%endraw%}</td></tr>
</table>

# Layout

### Table with borders

{: .table .table-bordered}
| Header1 | Header2 | Header3 |
|:---

---

--|:---

---

--|:---

---

--|
| column1 | column2 | column3 |

Markdown:
<pre>
{: .table .table-bordered}
| Header1 | Header2 | Header3 |
|:---

---

--|:---

---

--|:---

---

--|
| column1 | column2 | column3 |
</pre>

### Table without borders

{: .table }
| Header1 | Header2 | Header3 |
|:---

---

--|:---

---

--|:---

---

--|
| column1 | column2 | column3 |

Markdown:
<pre>
| Header1 | Header2 | Header3 |
|:---

---

--|:---

---

--|:---

---

--|
| column1 | column2 | column3 |
</pre>

### Tabbed Pane

<table border="1" cellpadding="10">
<colgroup><col span="1" style="width: 50%;"/><col span="1" style="width: 50%;"/></colgroup>
<tr><th> Example </th><th> Markdown </th></tr>
<tr><td>
{{% gsInitTab %}}
{{% gsTabContent "Foo " %}} This is tab Foo {{% /gsTabContent %}}
{{% gsTabContent "Bar " %}} This is tab Bar {{% /gsTabContent %}}
{{% /gsInitTab %}}
</td>
<td><pre>{%raw%}
{{% gsInitTab %}}
{{% gsTabContent "Foo " %}} This is tab Foo {{% /gsTabContent %}}
{{% gsTabContent "Bar " %}} This is tab Bar {{% /gsTabContent %}}
{{% /gsInitTab %}}
{%endraw%}</pre></td>
</tr>
</table>


### Cloak

<table border="1" cellpadding="10">
<colgroup><col span="1" style="width: 50%;"/><col span="1" style="width: 50%;"/></colgroup>
<tr><th> Example </th><th> Markdown </th></tr>
<tr><td>
{{% gsToggleCloak id="1 " %}}  **Click Here...**{{% /gsToggleCloak %}}
{{% gsCloak "1 " %}}
- Foo
- Bar
{{% /gsCloak %}}
</td><td><pre>{%raw%}
{{% gsToggleCloak id="1 " %}}  **Click Here...**{{% /gsToggleCloak %}}
{{% gsCloak "1 " %}}
- Foo
- Bar
{{% /gsCloak %}}
{%endraw%}</pre></td>
</tr>
</table>

# Macros

{: .table .table-bordered}
| **Description** | **Macro** | **Output** |
| Latest Cloudify Release version | {%raw%} {%latestcloudifyrelease%} {%endraw%} | {%latestcloudifyrelease%} |

