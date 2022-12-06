using GamaEvent_BackEnd.Interface;
using GamaEvent_BackEnd.Misc.Enum;
using GamaEvent_BackEnd.Interface;
using GamaEvent_BackEnd.Models;
using GamaEvent_BackEnd.Service;
using Gamania.SD.Helper.Model;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GamaEvent_BackEnd.Pages
{
    public class IndexModel : PageModel
    {

        //private readonly GamaEvent_BackEnd.Misc.AppSettings appSettings;
        //private readonly IGamaEventService gamaEventService;
        //private readonly IAnydoorService _anydoorService;

        //private readonly string User;

        //public IndexModel(GamaEvent_BackEnd.Misc.AppSettings appSettings, IGamaEventService gamaEventService, IAnydoorService _anydoorService)
        //{
        //    this.appSettings = appSettings;
        //    this.gamaEventService = gamaEventService;
        //    this._anydoorService = _anydoorService;
        //}

        public void OnGet()
        {

        }

        ///// <summary>
        ///// 取得遊戲列表
        ///// </summary>
        //public async Task<IActionResult> OnPostGetGames(string otp)
        //{
        //    var returnData = new CommonResultWithData<GameDataModel>() { Code = -2 };
        //    try
        //    {
        //        #region 檢查權限
        //        if (appSettings.Debug)
        //        {

        //        }
        //        else
        //        {
        //            AuthorityCheckInput authCheckInput = new AuthorityCheckInput()
        //            {
        //                OTP = otp,
        //                Function = FunctionEnum.Product,
        //                Ip = HttpContext.Features.Get<IHttpConnectionFeature>()?.RemoteIpAddress.ToString()
        //            };
        //            AnydoorCheckInput adrCheckInput = new AnydoorCheckInput()
        //            {
        //                OTP = otp,
        //                SystemId = appSettings.Anydoor.SystemId,
        //                FunctionId = FunctionEnum.Product.ToString(),
        //                Ip = HttpContext.Features.Get<IHttpConnectionFeature>()?.RemoteIpAddress.ToString()
        //            };
        //            ServiceResultWithData<AnydoorCheckOutput> adrCheckResult = await _anydoorService.CheckAuthorityAsync(adrCheckInput);
        //            if (!adrCheckResult.IsSuccess)
        //            {
        //                returnData.Message = adrCheckResult.ErrorText;
        //                return new JsonResult(returnData);
        //            }
        //        }
        //        #endregion 檢查權限

        //        var result = await gamaEventService.GetGameData();
        //        if (!result.IsSuccess)
        //        {
        //            returnData.Code = -2;
        //            returnData.Message = result.ErrorText;
        //        }
        //        else
        //        {
        //            returnData.Code = 1;
        //            returnData.ListData = result.ListData;
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        returnData.Code = -2;
        //        returnData.Message = ex.Message;

        //    }
        //    return new JsonResult(returnData);
        //}

        ///// <summary>
        ///// 取得活動列表
        ///// </summary>
        //public async Task<IActionResult> OnPostGetEventList(EventListInputDataModel eventListInputDataModel, string otp)
        //{
        //    var returnData = new CommonResultWithData<EventListDataModel>() { Code = -2 };
        //    try
        //    {
        //        #region 檢查權限
        //        if (appSettings.Debug)
        //        {

        //        }
        //        else
        //        {
        //            AuthorityCheckInput authCheckInput = new AuthorityCheckInput()
        //            {
        //                OTP = otp,
        //                Function = FunctionEnum.Product,
        //                Ip = HttpContext.Features.Get<IHttpConnectionFeature>()?.RemoteIpAddress.ToString()
        //            };
        //            AnydoorCheckInput adrCheckInput = new AnydoorCheckInput()
        //            {
        //                OTP = otp,
        //                SystemId = appSettings.Anydoor.SystemId,
        //                FunctionId = FunctionEnum.Product.ToString(),
        //                Ip = HttpContext.Features.Get<IHttpConnectionFeature>()?.RemoteIpAddress.ToString()
        //            };
        //            ServiceResultWithData<AnydoorCheckOutput> adrCheckResult = await _anydoorService.CheckAuthorityAsync(adrCheckInput);
        //            if (!adrCheckResult.IsSuccess)
        //            {
        //                returnData.Message = adrCheckResult.ErrorText;
        //                return new JsonResult(returnData);
        //            }
        //        }
        //        #endregion 檢查權限
        //        var result = await gamaEventService.GetEventList(eventListInputDataModel);
        //        if (!result.IsSuccess)
        //        {
        //            returnData.Code = -2;
        //            returnData.Message = result.ErrorText;
        //        }
        //        else
        //        {
        //            returnData.Code = 1;
        //            returnData.ListData = result.ListData;
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        returnData.Code = -2;
        //        returnData.Message = ex.Message;

        //    }
        //    return new JsonResult(returnData);
        //}

        ///// <summary>
        ///// 取得模板列表
        ///// </summary>
        //public async Task<IActionResult> OnPostGetPageType(string otp)
        //{
        //    var returnData = new CommonResultWithData<PageTypeDataModel>() { Code = -2 };
        //    try
        //    {
        //        #region 檢查權限
        //        if (appSettings.Debug)
        //        {

        //        }
        //        else
        //        {
        //            AuthorityCheckInput authCheckInput = new AuthorityCheckInput()
        //            {
        //                OTP = otp,
        //                Function = FunctionEnum.Product,
        //                Ip = HttpContext.Features.Get<IHttpConnectionFeature>()?.RemoteIpAddress.ToString()
        //            };
        //            AnydoorCheckInput adrCheckInput = new AnydoorCheckInput()
        //            {
        //                OTP = otp,
        //                SystemId = appSettings.Anydoor.SystemId,
        //                FunctionId = FunctionEnum.Product.ToString(),
        //                Ip = HttpContext.Features.Get<IHttpConnectionFeature>()?.RemoteIpAddress.ToString()
        //            };
        //            ServiceResultWithData<AnydoorCheckOutput> adrCheckResult = await _anydoorService.CheckAuthorityAsync(adrCheckInput);
        //            if (!adrCheckResult.IsSuccess)
        //            {
        //                returnData.Message = adrCheckResult.ErrorText;
        //                return new JsonResult(returnData);
        //            }
        //        }
        //        #endregion 檢查權限
        //        var result = await gamaEventService.GetPageType();
        //        if (!result.IsSuccess)
        //        {
        //            returnData.Code = -2;
        //            returnData.Message = result.ErrorText;
        //        }
        //        else
        //        {
        //            returnData.Code = 1;
        //            returnData.ListData = result.ListData;
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        returnData.Code = -2;
        //        returnData.Message = ex.Message;

        //    }
        //    return new JsonResult(returnData);
        //}

        ///// <summary>
        ///// 新增活動
        ///// </summary>
        //public async Task<IActionResult> OnPostAddEventList(EventListDataModel eventListDataModel, string otp)
        //{
        //    var returnData = new CommonResultWithData<int>()
        //    { Code = -2 };
        //    try
        //    {
        //        #region 檢查權限
        //        if (appSettings.Debug)
        //        {

        //        }
        //        else
        //        {
        //            AuthorityCheckInput authCheckInput = new AuthorityCheckInput()
        //            {
        //                OTP = otp,
        //                Function = FunctionEnum.Product,
        //                Ip = HttpContext.Features.Get<IHttpConnectionFeature>()?.RemoteIpAddress.ToString()
        //            };
        //            AnydoorCheckInput adrCheckInput = new AnydoorCheckInput()
        //            {
        //                OTP = otp,
        //                SystemId = appSettings.Anydoor.SystemId,
        //                FunctionId = FunctionEnum.Product.ToString(),
        //                Ip = HttpContext.Features.Get<IHttpConnectionFeature>()?.RemoteIpAddress.ToString()
        //            };
        //            ServiceResultWithData<AnydoorCheckOutput> adrCheckResult = await _anydoorService.CheckAuthorityAsync(adrCheckInput);
        //            if (!adrCheckResult.IsSuccess)
        //            {
        //                returnData.Message = adrCheckResult.ErrorText;
        //                return new JsonResult(returnData);
        //            }
        //        }
        //        #endregion 檢查權限
        //        var result = await gamaEventService.AddEventList(eventListDataModel, User);
        //        if (!result.IsSuccess)
        //        {
        //            returnData.Code = -2;
        //            returnData.Message = result.ErrorText;
        //        }
        //        else
        //        {
        //            returnData.Code = 1;
        //            returnData.Data = result.Data;
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        returnData.Code = -2;
        //        returnData.Message = ex.Message;

        //    }
        //    return new JsonResult(returnData);
        //}

        ///// <summary>
        ///// 送審/審核
        ///// </summary>
        //public async Task<IActionResult> OnPostApproveEvent(EventListDataModel eventListDataModel, string otp)
        //{
        //    var returnData = new CommonResultWithData<int>() { Code = -2 };
        //    try
        //    {
        //        #region 檢查權限
        //        if (appSettings.Debug)
        //        {

        //        }
        //        else
        //        {
        //            AuthorityCheckInput authCheckInput = new AuthorityCheckInput()
        //            {
        //                OTP = otp,
        //                Function = FunctionEnum.Product,
        //                Ip = HttpContext.Features.Get<IHttpConnectionFeature>()?.RemoteIpAddress.ToString()
        //            };
        //            AnydoorCheckInput adrCheckInput = new AnydoorCheckInput()
        //            {
        //                OTP = otp,
        //                SystemId = appSettings.Anydoor.SystemId,
        //                FunctionId = FunctionEnum.Product.ToString(),
        //                Ip = HttpContext.Features.Get<IHttpConnectionFeature>()?.RemoteIpAddress.ToString()
        //            };
        //            ServiceResultWithData<AnydoorCheckOutput> adrCheckResult = await _anydoorService.CheckAuthorityAsync(adrCheckInput);
        //            if (!adrCheckResult.IsSuccess)
        //            {
        //                returnData.Message = adrCheckResult.ErrorText;
        //                return new JsonResult(returnData);
        //            }
        //        }
        //        #endregion 檢查權限
        //        var result = await gamaEventService.ApproveEvent(eventListDataModel, User);
        //        if (!result.IsSuccess)
        //        {
        //            returnData.Code = -2;
        //            returnData.Message = result.ErrorText;
        //        }
        //        else
        //        {
        //            returnData.Code = 1;
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        returnData.Code = -2;
        //        returnData.Message = ex.Message;

        //    }
        //    return new JsonResult(returnData);
        //}
        ///// <summary>
        ///// 送審/審核
        ///// </summary>
        //public async Task<IActionResult> OnPostGetApprovedEvent(ApprovedEventInputDataModel approvedEventInputDataModel, string otp)
        //{
        //    var returnData = new CommonResultWithData<int>()
        //    { Code = -2 };
        //    try
        //    {
        //        #region 檢查權限
        //        if (appSettings.Debug)
        //        {

        //        }
        //        else
        //        {
        //            AuthorityCheckInput authCheckInput = new AuthorityCheckInput()
        //            {
        //                OTP = otp,
        //                Function = FunctionEnum.Product,
        //                Ip = HttpContext.Features.Get<IHttpConnectionFeature>()?.RemoteIpAddress.ToString()
        //            };
        //            AnydoorCheckInput adrCheckInput = new AnydoorCheckInput()
        //            {
        //                OTP = otp,
        //                SystemId = appSettings.Anydoor.SystemId,
        //                FunctionId = FunctionEnum.Product.ToString(),
        //                Ip = HttpContext.Features.Get<IHttpConnectionFeature>()?.RemoteIpAddress.ToString()
        //            };
        //            ServiceResultWithData<AnydoorCheckOutput> adrCheckResult = await _anydoorService.CheckAuthorityAsync(adrCheckInput);
        //            if (!adrCheckResult.IsSuccess)
        //            {
        //                returnData.Message = adrCheckResult.ErrorText;
        //                return new JsonResult(returnData);
        //            }
        //        }
        //        #endregion 檢查權限
        //        var result = await gamaEventService.GetApprovedEvent(approvedEventInputDataModel);
        //        if (!result.IsSuccess)
        //        {
        //            returnData.Code = -2;
        //            returnData.Message = result.ErrorText;
        //        }
        //        else
        //        {
        //            returnData.Code = 1;
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        returnData.Code = -2;
        //        returnData.Message = ex.Message;

        //    }
        //    return new JsonResult(returnData);
        //}
        ///// <summary>
        ///// 送審/審核
        ///// </summary>
        //public async Task<IActionResult> OnPostUpdateApprovedEvent(ApprovedEventDataModel approvedEventDataModel, string otp)
        //{
        //    var returnData = new CommonResultWithData<int>()
        //    { Code = -2 };
        //    try
        //    {
        //        #region 檢查權限
        //        if (appSettings.Debug)
        //        {

        //        }
        //        else
        //        {
        //            AuthorityCheckInput authCheckInput = new AuthorityCheckInput()
        //            {
        //                OTP = otp,
        //                Function = FunctionEnum.Product,
        //                Ip = HttpContext.Features.Get<IHttpConnectionFeature>()?.RemoteIpAddress.ToString()
        //            };
        //            AnydoorCheckInput adrCheckInput = new AnydoorCheckInput()
        //            {
        //                OTP = otp,
        //                SystemId = appSettings.Anydoor.SystemId,
        //                FunctionId = FunctionEnum.Product.ToString(),
        //                Ip = HttpContext.Features.Get<IHttpConnectionFeature>()?.RemoteIpAddress.ToString()
        //            };
        //            ServiceResultWithData<AnydoorCheckOutput> adrCheckResult = await _anydoorService.CheckAuthorityAsync(adrCheckInput);
        //            if (!adrCheckResult.IsSuccess)
        //            {
        //                returnData.Message = adrCheckResult.ErrorText;
        //                return new JsonResult(returnData);
        //            }
        //        }
        //        #endregion 檢查權限
        //        var result = await gamaEventService.UpdateApprovedEvent(approvedEventDataModel, User);
        //        if (!result.IsSuccess)
        //        {
        //            returnData.Code = -2;
        //            returnData.Message = result.ErrorText;
        //        }
        //        else
        //        {
        //            returnData.Code = 1;
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        returnData.Code = -2;
        //        returnData.Message = ex.Message;

        //    }
        //    return new JsonResult(returnData);
        //}
    }
}