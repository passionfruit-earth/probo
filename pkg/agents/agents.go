// Copyright (c) 2025 Probo Inc <hello@getprobo.com>.
//
// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.
//
// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
// REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
// AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
// INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
// LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
// OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
// PERFORMANCE OF THIS SOFTWARE.

package agents

import (
	"github.com/openai/openai-go"
	"github.com/openai/openai-go/option"
	"go.gearno.de/kit/log"
)

type (
	Agent struct {
		l      *log.Logger
		cfg    Config
		client *openai.Client
	}

	Config struct {
		OpenAIAPIKey string
		Temperature  float64
		ModelName    string
	}
)

func NewAgent(l *log.Logger, cfg Config) *Agent {
	client := openai.NewClient(option.WithAPIKey(cfg.OpenAIAPIKey))

	return &Agent{l: l, cfg: cfg, client: &client}
}
