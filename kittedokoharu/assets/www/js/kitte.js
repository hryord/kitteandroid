//----------------------------------------------------------------
//
// kitte.js
// Summary: 切手組み合わせ作成JavaScript
// Author : Ayumi Tagawa
//
//----------------------------------------------------------------

//---------------------------------------------------------------
// 初期画面
//---------------------------------------------------------------
$(document).on("pageinit", "#topPage", function()
{
	// 「組合せを調べる」ボタン押下時
	$("#searchButton").click( function()
	{
		var input_num = $("#input_number").val();
		if( input_num == "" )
		{
			alert("金額を入力してください");
			return false; // リンク先に飛ばさない
		}
		if( input_num.match( /[^0-9]+/ ) )
		{
			alert("半角数値を入力しください");
			return false; // リンク先に飛ばさない
		}
	});

	// 金額選択プルダウン選択時
	$("#postalAmount").on("change", function(event)
	{
		/*
		if($(this).val() == 0)
		{
			$("#input_number").textinput("enable");
		}
		else
		{
			$("#input_number").textinput("disable");
		}
		*/

		$("#input_number").val($(this).val());
	});

	//XXX	$("#search_form").validate();
});

//---------------------------------------------------------------
// 計算結果画面
//---------------------------------------------------------------
$(document).on('pageinit', '#resultPage', function()
{
	$('#resultPage').on('pageshow', function()
	{
		// 切手の計算をする（最小枚数計算）
		var amount = $('#input_number').val();
		// タイトルに目標金額を設定
		$("#title").text(amount + "円分の切手");

		// 1) 使用する切手の情報を配列に入れる
		var stampList = [];
		$('#stampList option:selected').each(function()
		{
			stampList.unshift($(this).val());
		});

		// 金額の大きい切手から順番に割って、商と余りを計算する
		// 最後の切手まで計算して余りがある場合には「計算できません」と表示
		var resultList = [];
		resultList = combine(amount, stampList, 0);

		$("#resultList").empty();
		if (resultList == null)
		{
			alert("組合せがありません");
		}
		else
		{
			//resultList.sort(asc);
			for (var i = 0; i < resultList.length; i++)
			{
				$("#resultList").append(
					$("<tr>").append(
						$("<td>").append('<img src="img/pic_' + resultList[i][0] + '_en.gif" width="50%" height="50%"/>'),
						$("<td>").text(resultList[i][0] + "円切手"),
						$("<td>").text("× " + resultList[i][1] + "枚")
					)
				);
			}
		}

	});
});


//---------------------------------------------------------------
// 共通関数

// 最小枚数を見つけるアルゴリズム
function combine( amount, stampList, no )
{
	if( no > stampList.length - 1 ) return null;

	var stamp_count = Math.floor(amount / stampList[no]);
	var amari = amount % stampList[no];

	if( amari === 0 )
	{
		return new Array( new Array(stampList[no], stamp_count) );
	}
	else
	{
		// 金額に対して切手を全て当てはめた状態から減らしていって、組合せを検索する
		for( var i = stamp_count ; i >= 0; i-- )
		{
			// 切手のリストが終わっていたら終わり
			var result = combine( amount - (stampList[no] * i), stampList, no+1);
			if( result == null ) continue;

			if(i === 0)
			{
				return result;
			}
			else
			{
				result.push( new Array(stampList[no],i) );
			}

			return result;
		}
		return null;
	}
}

// 配列昇順ソート
function asc( a, b )
{
	return ( a - b );
}

// 配列降順ソート
function desc( a, b )
{
	return ( b - a );
}
